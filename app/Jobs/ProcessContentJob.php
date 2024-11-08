<?php

namespace App\Jobs;

use App\Enums\ContentType;
use App\Enums\PdfStatus;
use App\Events\UploadEvent;
use App\Models\Content;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Pdf;
use App\Models\Section;
use App\Models\Subsection;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class ProcessContentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $processed_data;
    protected $course_id;
    protected $file_name;

    public function __construct($course_id, $processed_data, $file_name)
    {
        $this->processed_data = $processed_data;
        $this->course_id = $course_id;
        $this->file_name = $file_name;
    }

    public function handle()
    {
        DB::beginTransaction();

        $contentTypes = ['Tables', 'Figures', 'Codes', 'Content'];
        try {
            foreach ($this->processed_data['Modules'] as $moduleData) {
                Log::info('Processing module', ['module_title' => $moduleData['Title']]);

                $module = Module::create([
                    'course_id' => $this->course_id,
                    'title' => $moduleData['Title'],
                ]);

                foreach ($contentTypes as $contentType) {
                    if (isset($moduleData[$contentType]) && is_array($moduleData[$contentType])) {
                        foreach ($moduleData[$contentType] as $item) {
                            if (is_array($item) && isset($item['type'])) {
                                $this->processContent($item, $module);
                            }
                        }
                    }
                }

                foreach ($moduleData['Lessons'] as $lessonData) {
                    Log::info('Processing lesson', ['lesson_title' => $lessonData['Title']]);

                    $lesson = Lesson::create([
                        'module_id' => $module->module_id,
                        'title' => $lessonData['Title'],
                    ]);

                    foreach ($contentTypes as $contentType) {
                        if (isset($lessonData[$contentType]) && is_array($lessonData[$contentType])) {
                            foreach ($lessonData[$contentType] as $item) {
                                if (is_array($item) && isset($item['type'])) {
                                    $this->processContent($item, $lesson);
                                }
                            }
                        }
                    }

                    foreach ($lessonData['Sections'] as $sectionData) {
                        $sectionTitle = $sectionData['Title'];
                        Log::info('Processing section', [
                            'section_title' => $sectionTitle,
                            'section_content' => $sectionData['Content']
                        ]);

                        $section = Section::create([
                            'lesson_id' => $lesson->lesson_id,
                            'title' => $sectionTitle,
                        ]);

                        foreach ($contentTypes as $contentType) {
                            // Check if the content type exists in the current section and is an array
                            if (isset($sectionData[$contentType]) && is_array($sectionData[$contentType])) {
                                foreach ($sectionData[$contentType] as $item) {
                                    if (is_array($item) && isset($item['type'])) {
                                        $this->processContent($item, $section);
                                    }
                                }
                            }
                        }

                        foreach ($sectionData['Subsections'] as $subsectionData) {
                            $subsectionTitle = $subsectionData['Title'];
                            Log::info('Processing subsection', [
                                'subsection_title' => $subsectionTitle,
                                'subsection_content' => $subsectionData['Content']
                            ]);

                            $subsection = Subsection::create([
                                'section_id' => $section->section_id,
                                'title' => $subsectionTitle,
                            ]);

                            foreach ($contentTypes as $contentType) {
                                // Check if the content type exists in the current section and is an array
                                if (isset($subsectionData[$contentType]) && is_array($subsectionData[$contentType])) {
                                    foreach ($subsectionData[$contentType] as $item) {
                                        if (is_array($item) && isset($item['type'])) {
                                            $this->processContent($item, $subsection);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            Log::info("done with processing content");
            $pdf = Pdf::where('course_id', $this->course_id)
                ->where('file_name', $this->file_name)
                ->firstOrFail();
            $pdf->status = PdfStatus::SUCCESS->value;
            $pdf->save();
            DB::commit();

            $this->broadcastEvent(null, "Successfully processed the PDF", null);
            Log::info('Successfully stored processed PDF data');
            return response()->json(['message' => 'Processed PDF data stored successfully'], 201);
        } catch (Exception $e) {
            DB::rollBack();

            // Handle the failure case
            try {
                // Set status to FAILED if an error occurs
                $pdf = Pdf::where('course_id', $this->course_id)
                    ->where('file_name', $this->file_name)
                    ->firstOrFail();
                $pdf->status = PdfStatus::FAILED->value;
                $pdf->save();

                DB::commit();  // Commit the FAILED status update

            } catch (Exception $innerException) {
                Log::error('Failed to update PDF status to FAILED', ['error' => $innerException->getMessage()]);
            }

            $this->broadcastEvent(null, null, "Failed to process PDF data");
            Log::error('Failed to store processed PDF data', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to store processed PDF data', 'error' => $e->getMessage()], 500);
        }
    }


    private function processContent($contentItem, $parent)
    {
        // Prepare content data
        $contentData = [
            'type' => match ($contentItem['type']) {
                'Figures' => ContentType::FIGURE->value,
                'Tables' => ContentType::TABLE->value,
                'Code' => ContentType::CODE->value,
                'Text' => ContentType::TEXT->value,
                'Header' => ContentType::HEADER->value,
                default => throw new InvalidArgumentException("Invalid content type"),
            },
            'text' => $contentItem['text'] ?? null,
            'image_base64' => $contentItem['image_base64'] ?? null,
            'caption' => $contentItem['before_caption'] ?? $contentItem['after_caption'] ?? "",
            'order' => isset($contentItem['order']) ? (int) $contentItem['order'] : null,
        ];

        Log::info('Processing content item', ['contentData' => $contentData['caption']]);

        // Process content
        $this->createContent($contentData, $parent);
    }

    private function createContent($data, $parent)
    {
        // Prepare content data without manually setting contentable_id and contentable_type
        $contentData = [
            'type' => $data['type'],
            'description' => $data['text'] ?? '',
            'caption' => $data['caption'],
            'order' => $data['order'],
            'file_name' => '',  // Will be updated if image is saved
            'file_path' => '',  // Will be updated if image is saved
        ];

        // Use polymorphic relationship to create content
        $content = $parent->contents()->create($contentData);

        // Store image if available
        if (isset($data['image_base64'])) {
            $imageName = $this->storeBase64Image($data['image_base64'], $data['type'], $content);
            ProcessImageJob::dispatch($imageName, strtolower($data['type']), $content);
        }

        return $content;
    }


    private function storeBase64Image($base64Image, $type, $content)
    {
        $image = base64_decode($base64Image);
        $imageName = uniqid() . '.png';

        // Use the lowercase version of the enum value directly as the folder name
        $folder = strtolower($type);

        Storage::disk($folder)->put($imageName, $image);

        $imagePath = Storage::disk($folder)->url($imageName);

        // Update content with file name and path
        $content->update([
            'file_name' => $imageName,
            'file_path' => $imagePath,
        ]);

        return $imageName;  // Return full image path for consistency
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
}
