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
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels,Batchable;

    protected $moduleData;
    protected $courseId;

    public function __construct($moduleData, $courseId)
    {
        $this->moduleData = $moduleData;
        $this->courseId = $courseId;
    }

    public function handle()
    {
        DB::beginTransaction();
        try {
            $module = Module::create([
                'course_id' => $this->courseId,
                'title' => $this->moduleData['Title'],
            ]);

            $this->processLessons($module);
            DB::commit();
            Log::info('Successfully processed module', ['module' => $this->moduleData['Title']]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to process module', ['module' => $this->moduleData['Title'], 'error' => $e->getMessage()]);
            throw $e;
        }
    }

    // private function processLessons(Module $module)
    // {
    //     foreach ($this->moduleData['Lessons'] as $lessonData) {
    //         $lesson = Lesson::create([
    //             'module_id' => $module->module_id,
    //             'title' => $lessonData['Title'],
    //         ]);
    //         $this->processSections($lesson, $lessonData['Sections']);
    //     }
    // }
    private function processLessons(Module $module)
    {
        if (!isset($this->moduleData['Lessons']) || !is_array($this->moduleData['Lessons'])) {
            Log::warning("No lessons found for module: " . $module->title);
            return; // Or throw an exception if lessons are required
        }

        foreach ($this->moduleData['Lessons'] as $lessonData) {
            $lesson = Lesson::create([
                'module_id' => $module->module_id, 
                'title' => $lessonData['Title'],
            ]);
            $this->processSections($lesson, $lessonData['Sections'] ?? []); // Handle missing sections
        }
    }

    private function processSections(Lesson $lesson, $sections)
    {
        foreach ($sections as $sectionData) {
            $section = Section::create([
                'lesson_id' => $lesson->lesson_id,
                'title' => $sectionData['Title'],
            ]);
            $this->processSubsections($section, $sectionData['Subsections']);
            $this->processContents($section, $sectionData);
        }
    }

    private function processSubsections(Section $section, $subsections)
    {
        foreach ($subsections as $subsectionData) {
            $subsection = Subsection::create([
                'section_id' => $section->section_id,
                'title' => $subsectionData['Title'],
            ]);
            $this->processContents($subsection, $subsectionData);
        }
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
        // $contentData = [
        //     'type' => $data['type'],
        //     'description' => $data['text'] ?? '',
        //     'caption' => $data['caption'],
        //     'order' => $data['order'],
        //     'file_name' => '',  // Will be updated if image is saved
        //     'file_path' => '',  // Will be updated if image is saved
        // ];
        $contentData = [
            'type' => match ($data['type']) {
                'Figures' => ContentType::FIGURE->value,
                'Tables' => ContentType::TABLE->value,
                'Code' => ContentType::CODE->value,
                'Text' => ContentType::TEXT->value,
                'Header' => ContentType::HEADER->value,
                default => throw new InvalidArgumentException("Invalid content type"),
            },
            'description' => $data['text'] ?? null,
            'image_base64' => $data['image_base64'] ?? null,
            'caption' => $data['before_caption'] ?? $data['after_caption'] ?? "",
            'order' => isset($data['order']) ? (int) $data['order'] : null,
        ];

        // Use polymorphic relationship to create content
        $content = $parent->contents()->create($contentData);

        // Store image if available
        // if (isset($data['image_base64'])) {
        //     $imageName = $this->storeBase64Image($data['image_base64'], $data['type'], $content);
        //     ProcessBase64ImageJob::dispatch($imageName, strtolower($data['type']), $content);
        // }
        if (isset($data['image_base64'])) {
            ProcessBase64ImageJob::dispatch($data['image_base64'], $content, $data['type']);
        }

        return $content;
    }
}
