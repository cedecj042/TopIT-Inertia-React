<?php

namespace App\Jobs;


use App\Enums\ContentType;
use App\Models\{Module, Lesson, Section, Subsection, Content};
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class ProcessModuleJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    protected $moduleData;
    protected $courseId;
    public $timeout = 300;
    public function __construct($moduleData, $courseId)
    {
        $this->moduleData = $moduleData;
        $this->courseId = $courseId;
    }

    public function handle()
    {
        \DB::reconnect();
        $module = Module::create([
            'module_uid' => $this->moduleData['module_uid'],
            'course_id' => $this->courseId,
            'title' => $this->moduleData['Title'],
        ]);

        $this->processContents($module, $this->moduleData);
        $this->processLessons($module);
        Log::info('Successfully processed module', ['module' => $this->moduleData['Title']]);

    }
    private function processLessons(Module $module)
    {
        if (!isset($this->moduleData['Lessons']) || !is_array($this->moduleData['Lessons'])) {
            Log::warning("No lessons found for module: " . $module->title);
            return;
        }

        $lessons = collect($this->moduleData['Lessons']);
        $existingLessons = Lesson::where('module_id', $module->module_id)
            ->whereIn('lesson_uid', $lessons->pluck('lesson_uid'))
            ->get()
            ->keyBy('lesson_uid');

        $lessonData = [];
        foreach ($this->moduleData['Lessons'] as $lessonDataItem) {
            if (!isset($existingLessons[$lessonDataItem['lesson_uid']])) {
                $lessonData[] = [
                    'module_id' => $module->module_id,
                    'lesson_uid' => $lessonDataItem['lesson_uid'],
                    'title' => $lessonDataItem['Title'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (count($lessonData)) {
            Lesson::insert($lessonData);
        }

        unset($lessonData, $existingLessons);
        gc_collect_cycles();

        foreach ($this->moduleData['Lessons'] as $lessonDataItem) {
            $lesson = Lesson::where('lesson_uid', $lessonDataItem['lesson_uid'])->first();
            if ($lesson) {
                $this->processSections($lesson, $lessonDataItem['Sections'] ?? []);
                $this->processContents($lesson, $lessonDataItem);
            } else {
                Log::warning("Lesson with lesson_uid {$lessonDataItem['lesson_uid']} not found.");
            }
        }
    }

    private function processSections(Lesson $lesson, $sections)
    {
        $sectionData = [];
        $sections = collect($sections);

        // Fetch existing sections based on section_uid
        $existingSections = Section::where('lesson_id', $lesson->lesson_id)
            ->whereIn('section_uid', $sections->pluck('section_uid')) // Use pluck to get section_uids
            ->get()
            ->keyBy('section_uid');

        foreach ($sections as $sectionDataItem) {
            if (!isset($existingSections[$sectionDataItem['section_uid']])) {
                $sectionData[] = [
                    'lesson_id' => $lesson->lesson_id,
                    'section_uid' => $sectionDataItem['section_uid'],
                    'title' => $sectionDataItem['Title'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Upsert the new sections if necessary
        if (count($sectionData)) {
            Section::upsert($sectionData, ['lesson_id', 'section_uid'], ['updated_at', 'title']);
        }

        // Re-fetch existing sections to ensure the latest data is available after upsert
        $existingSections = Section::where('lesson_id', $lesson->lesson_id)
            ->whereIn('section_uid', $sections->pluck('section_uid'))
            ->get()
            ->keyBy('section_uid');

        // Process each section and its subsections and contents
        foreach ($sections as $sectionDataItem) {
            $section = $existingSections[$sectionDataItem['section_uid']] ?? null;
            if ($section) {
                $this->processSubsections($section, $sectionDataItem['Subsections'] ?? []);
                $this->processContents($section, $sectionDataItem);
            } else {
                Log::warning("Section with section_uid {$sectionDataItem['section_uid']} not found.");
            }
        }

        // Free memory after processing sections
        unset($sectionData, $existingSections);
        gc_collect_cycles();
    }

    private function processSubsections(Section $section, $subsections)
    {
        $subsectionData = [];
        $subsections = collect($subsections);

        // Fetch existing subsections based on subsection_uid
        $existingSubsections = Subsection::where('section_id', $section->section_id)
            ->whereIn('subsection_uid', $subsections->pluck('subsection_uid'))
            ->get()
            ->keyBy('subsection_uid');

        foreach ($subsections as $subsectionDataItem) {
            if (!isset($existingSubsections[$subsectionDataItem['subsection_uid']])) {
                $subsectionData[] = [
                    'section_id' => $section->section_id,
                    'subsection_uid' => $subsectionDataItem['subsection_uid'],
                    'title' => $subsectionDataItem['Title'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Upsert subsections if necessary
        if (count($subsectionData)) {
            Subsection::upsert($subsectionData, ['section_id', 'subsection_uid'], ['updated_at', 'title']);
        }

        foreach ($subsections as $subsectionDataItem) {
            $subsection = Subsection::where('subsection_uid', $subsectionDataItem['subsection_uid'])->first();
            if ($subsection) {
                $this->processContents($subsection, $subsectionDataItem);
            } else {
                Log::warning("Subsection with subsection_uid {$subsectionDataItem['subsection_uid']} not found.");
            }
        }

        // Free memory after processing subsections
        unset($subsectionData, $existingSubsections);
        gc_collect_cycles();
    }

    private function processContents($parent, $data)
    {
        $contentTypes = ['Tables', 'Figures', 'Codes', 'Content'];
        foreach ($contentTypes as $contentType) {
            if (!isset($data[$contentType]))
                continue;
            foreach ($data[$contentType] as $contentItem) {
                if (isset($contentItem['type'])) {
                    $this->createContent($contentItem, $parent);
                }
            }
        }
    }

    private function createContent($data, $parent)
    {
        $validTypes = ['Figures', 'Tables', 'Code', 'Text', 'Header'];

        if (!in_array($data['type'], $validTypes)) {
            Log::warning("Skipped invalid content type: " . $data['type']);
            return;
        }
        $contentData = [
            'type' => match ($data['type']) {
                'Figures' => ContentType::FIGURE->value,
                'Tables' => ContentType::TABLE->value,
                'Code' => ContentType::CODE->value,
                'Text' => ContentType::TEXT->value,
                'Header' => ContentType::HEADER->value,
            },
            'description' => $data['text'] ?? null,
            'image_base64' => $data['image_base64'] ?? null,
            'caption' => $data['before_caption'] ?? $data['after_caption'] ?? "",
            'order' => isset($data['order']) ? (int) $data['order'] : null,
        ];

        $content = $parent->contents()->create($contentData);

        if (isset($data['image_base64'])) {
            ProcessBase64ImageJob::dispatch($data['image_base64'], $content, $data['type']);
        }

        return $content;
    }
}
