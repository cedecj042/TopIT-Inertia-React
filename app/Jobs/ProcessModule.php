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
                        'contents', // Get contents directly associated with the module
                        'lessons.contents', // Contents associated with lessons
                        'lessons.sections.contents', // Contents associated with sections
                        'lessons.sections.subsections.contents' // Contents associated with subsections
                    ])->find($moduleId);

                    if (!$module) {
                        Log::error("Module with ID $moduleId not found.");
                        continue; // Skip to the next module if not found
                    }

                    // Prepare the module data in the required format
                    $moduleData = [
                        'module_id' => $module->module_id,
                        'course_id' => $module->course_id,
                        'title' => $module->title,
                        'contents' => $this->formatContents($module->contents), // Contents for module
                        'lessons' => $module->lessons->map(function ($lesson) {
                            return [
                                'lesson_id' => $lesson->lesson_id,
                                'title' => $lesson->title,
                                'contents' => $this->formatContents($lesson->contents), // Contents for lesson
                                'sections' => $lesson->sections->map(function ($section) {
                                    return [
                                        'section_id' => $section->section_id,
                                        'title' => $section->title,
                                        'contents' => $this->formatContents($section->contents), // Contents for section
                                        'subsections' => $section->subsections->map(function ($subsection) {
                                            return [
                                                'subsection_id' => $subsection->subsection_id,
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
            Log::info("Sending all module data to FastAPI", ['module_data' => $allModulesData]);
            
            // Send all module data to FastAPI for processing
            $result = $fastApiService->sendToFastAPI($allModulesData, 'add-modules/');

            if ($result) {
                Log::info('Data was successfully sent to FastAPI.');
                $this->broadcastEvent(null, "Successfully vectorized selected modules", null);
            } else {
                Log::warning('Data failed to send to FastAPI.');
                $this->broadcastEvent(null, null, "Failed to process modules.");
            }
        } catch (\Exception $e) {
            Log::error('Error processing course: ' . $e->getMessage());
            $this->broadcastEvent(null, null, "Failed to process modules.");
        }
    }

    /**
     * Helper function to format contents based on content type
     */
    private function formatContents($contents)
    {
        return $contents->map(function ($content) {
            // Include basic fields for all content types
            $formattedContent = [
                'content_id' => $content->content_id,
                'type' => $content->type,
                'description' => $content->description,
                'order' => $content->order,
            ];

            // Include additional fields for Table, Figure, and Code types
            if (in_array($content->type, ['Table', 'Figure', 'Code'])) {
                $formattedContent['caption'] = $content->caption ?? "";
            }

            return $formattedContent;
        });
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
}
