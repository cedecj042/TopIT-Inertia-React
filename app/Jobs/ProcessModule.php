<?php

namespace App\Jobs;

use App\Events\UploadEvent;
use App\Services\FastApiService;
use App\Models\Module;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessModule implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $selectedCourses;

    public function __construct(array $selectedCourses)
    {
        $this->selectedCourses = $selectedCourses;
    }


    public function handle(FastApiService $fastApiService)
    {
        try {
            Log::info('Starting ProcessModule job', [
                'selected_courses' => $this->selectedCourses,
            ]);

            $allModulesData = []; // To accumulate all modules data

            // Access the 'courses' key within the selected courses
            $courses = $this->selectedCourses['courses'] ?? [];

            if (empty($courses)) {
                Log::warning('No courses found in selected courses.');
            }

            // Loop through each selected course and its modules
            foreach ($courses as $courseId => $moduleIds) {
                Log::info("Processing course with ID: $courseId");

                // Loop through each selected module for the current course
                foreach ($moduleIds as $moduleId) {
                    Log::info("Processing module with ID: $moduleId for course ID: $courseId");

                    // Fetch the module by its ID with its related data
                    $module = Module::with([
                        'contents',
                        'lessons.contents',
                        'lessons.sections.contents',
                        'lessons.sections.subsections.contents'
                    ])
                    ->where('module_id', $moduleId)
                    ->first();

                    if (!$module) {
                        Log::error("Module with ID $moduleId not found.");
                        continue; // Skip to the next module if not found
                    }

                    // Prepare the module data in the required format
                    $moduleData = [
                        'module_id' => $module->module_id,
                        'module_uid' => $module->module_uid,
                        'course_id' => $module->course_id,
                        'title' => $module->title,
                        'contents' => $this->formatContents($module->contents), // Contents for module
                        'lessons' => $module->lessons->map(function ($lesson) {
                            return [
                                'lesson_id' => $lesson->lesson_id,
                                'lesson_uid' => $lesson->lesson_uid,
                                'title' => $lesson->title,
                                'contents' => $this->formatContents($lesson->contents), // Contents for lesson
                                'sections' => $lesson->sections->map(function ($section) {
                                    return [
                                        'section_id' => $section->section_id,
                                        'section_uid' => $section->section_uid,
                                        'title' => $section->title,
                                        'contents' => $this->formatContents($section->contents), // Contents for section
                                        'subsections' => $section->subsections->map(function ($subsection) {
                                            return [
                                                'subsection_id' => $subsection->subsection_id,
                                                'subsection_uid' => $subsection->subsection_uid,
                                                'title' => $subsection->title,
                                                'contents' => $this->formatContents($subsection->contents), // Contents for subsection
                                            ];
                                        }),
                                    ];
                                }),
                            ];
                        }),
                    ];

                    // Add the module data to the array
                    $allModulesData[] = $moduleData;
                }
            }

            // Convert the entire list of module data to a JSON string
            $jsonData = json_encode($allModulesData, JSON_PRETTY_PRINT);
            $fileName = "all_modules_data_" . date('Y_m_d_H_i_s') . ".json";

            // Use Laravel's Storage facade to store the file
            Storage::disk('local')->put("public/json/{$fileName}", $jsonData);

            $result = $fastApiService->sendToFastAPI($allModulesData, 'add-modules/');
            
            if ($result) {
                Log::info('Data sent to FastAPI successfully. Waiting for vectorization callback.');
                $this->broadcastEvent("Modules are being vectorized...", null, null);
            } else {
                Log::warning('Data failed to send to FastAPI.');
                $this->broadcastEvent(null, null, "Failed to send data to FastAPI.");
            }
        } catch (\Exception $e) {
            Log::error('Error processing course: ' . $e->getMessage());
            $this->broadcastEvent(null, null, "Failed to process modules.");
        }
    }

    private function formatContents($contents)
    {
        return $contents->map(function ($content) {
            $description = $this->sanitizeForJson($content->description ?? "");
    
            $formattedContent = [
                'content_id' => $content->content_id,
                'type' => $content->type,
                'description' => $description,
            ];
    
            if (in_array($content->type, ['Table', 'Figure', 'Code'])) {
                $formattedContent['caption'] = $content->caption ?? "";
            }
    
            return $formattedContent;
        })->toArray(); // 🔥 This is what converts the Collection to a plain array
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
    private function sanitizeForJson($string)
    {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}
