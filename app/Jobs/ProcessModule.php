<?php

namespace App\Jobs;

use App\Services\FastApiService;
use App\Models\Module;
use File;
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
    protected $selectedModules; // Nested array of modules per course

    /**
     * Create a new job instance.
     *
     * @param array $selectedCourses
     * @param array $selectedModules
     */
    public function __construct(array $selectedCourses, array $selectedModules)
    {
        $this->selectedCourses = $selectedCourses;
        $this->selectedModules = $selectedModules;
    }

    /**
     * Execute the job.
     *
     * @param FastApiService $fastApiService
     * @return void
     */
    public function handle(FastApiService $fastApiService)
    {
        try {
            Log::info('Starting ProcessModule job', [
                'selected_courses' => $this->selectedCourses,
                'selected_modules' => $this->selectedModules
            ]);

            $allModulesData = []; // To accumulate all modules data

            // Loop through each selected course
            foreach ($this->selectedCourses as $courseId) {
                Log::info("Processing course with ID: $courseId");

                // Check if the course has modules selected
                if (isset($this->selectedModules[$courseId])) {
                    Log::info("Found modules for course ID: $courseId", ['modules' => $this->selectedModules[$courseId]]);

                    // Loop through each selected module for the current course
                    foreach ($this->selectedModules[$courseId] as $moduleId) {
                        Log::info("Processing module with ID: $moduleId for course ID: $courseId");

                        // Fetch the module by its ID with its related data
                        $module = Module::with([
                            'lessons.sections.subsections',
                            'lessons.sections.tables',
                            'lessons.sections.figures',
                            'lessons.sections.codes',
                            'lessons.sections.subsections.tables',
                            'lessons.sections.subsections.figures',
                            'lessons.sections.subsections.codes'
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
                            'content' => $this->decodeContent($module->content), // JSON content
                            'lessons' => $module->lessons->map(function ($lesson) {
                                return [
                                    'lesson_id' => $lesson->lesson_id,
                                    'title' => $lesson->title,
                                    'content' => $this->decodeContent($lesson->content),
                                    'sections' => $lesson->sections->map(function ($section) {
                                        return [
                                            'section_id' => $section->section_id,
                                            'title' => $section->title,
                                            'content' => $this->decodeContent($section->content),
                                            'tables' => $section->tables->map(function ($table) {
                                                return [
                                                    'table_id' => $table->table_id,
                                                    'description' => $table->description,
                                                    'caption' => $table->caption ?? "",
                                                ];
                                            }),
                                            'figures' => $section->figures->map(function ($figure) {
                                                return [
                                                    'figure_id' => $figure->figure_id,
                                                    'description' => $figure->description,
                                                    'caption' => $figure->caption ?? "",
                                                ];
                                            }),
                                            'codes' => $section->codes->map(function ($code) {
                                                return [
                                                    'code_id' => $code->code_id,
                                                    'description' => $code->description,
                                                    'caption' => $code->caption ?? "",
                                                ];
                                            }),
                                            'subsections' => $section->subsections->map(function ($subsection) {
                                                return [
                                                    'subsection_id' => $subsection->subsection_id,
                                                    'title' => $subsection->title,
                                                    'content' => $this->decodeContent($subsection->content),
                                                    'tables' => $subsection->tables->map(function ($table) {
                                                        return [
                                                            'table_id' => $table->table_id,
                                                            'description' => $table->description,
                                                            'caption' => $table->caption ?? "",
                                                        ];
                                                    }),
                                                    'figures' => $subsection->figures->map(function ($figure) {
                                                        return [
                                                            'figure_id' => $figure->figure_id,
                                                            'description' => $figure->description,
                                                            'caption' => $figure->caption ?? "",
                                                        ];
                                                    }),
                                                    'codes' => $subsection->codes->map(function ($code) {
                                                        return [
                                                            'code_id' => $code->code_id,
                                                            'description' => $code->description,
                                                            'caption' => $code->caption ?? ""
                                                        ];
                                                    }),
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
                } else {
                    Log::warning("No modules found for course with ID: $courseId");
                }
            }

            // Convert the entire list of module data to a JSON string
            $jsonData = json_encode($allModulesData, JSON_PRETTY_PRINT);

            // Define the file name with a timestamp
            $fileName = "all_modules_data_" . date('Y_m_d_H_i_s') . ".json";

            // Use Laravel's Storage facade to store the file
            Storage::disk('local')->put("public/json/{$fileName}", $jsonData);

            Log::info("Saved all module JSON data locally using Storage facade.");

            Log::info("Sending all module data to FastAPI", ['module_data' => $allModulesData]);

            // Send all module data to FastAPI for processing
            $fastApiService->sendToFastAPI($allModulesData, 'add-modules/');

            Log::info('All modules processed successfully.');

        } catch (\Exception $e) {
            Log::error('Error processing course: ' . $e->getMessage());
        }
    }

    // Helper function to decode JSON content
    private function decodeContent($content)
    {
        // Check if content is already an array or object
        if (is_array($content) || is_object($content)) {
            return $content;
        }

        // Try decoding the content as JSON
        $decoded = json_decode($content, true);

        // If decoding is successful, return the decoded content
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        // If not valid JSON, return the content as is (possibly a plain string)
        return $content;
    }
}
