<?php

namespace App\Jobs;

use App\Models\Course;
use App\Services\FastApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateQuestionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $requestData;
    protected $courseTitles;

    /**
     * Create a new job instance.
     *
     * @param array $requestData Form input data, structured.
     */
    public function __construct(array $requestData)
    {
        $this->requestData = $requestData;
    }

    /**
     * Execute the job.
     */
    public function handle(FastApiService $fastApiService)
    {
        $questionsData = [];

        foreach ($this->requestData as $key => $value) {
            Log::info("Processing key: $key with value: $value");
            if (preg_match('/^num_([a-zA-Z]+)_([a-zA-Z\-]+)_([0-9]+)$/', $key, $matches)) {
                $difficulty = $matches[1]; // Difficulty level (VeryEasy, Easy, Normal, Hard, VeryHard)
                $typeKey = $matches[2];    // Question type (identification, multichoice-single, multichoice-many)
                $courseId = $matches[3];   // Course ID
                
                $course = Course::findOrFail($courseId);

                if (!$this->courseExists($questionsData, $courseId)) {
                    Log::info("Course not found. Adding course with ID: $courseId and title: {$course->title}");
                    $questionsData[] = [
                        'course_id' => $courseId,
                        'course_title' => $course->title,
                        'questions' => []
                    ];
                } else {
                    Log::info("Course with ID: $courseId already exists.");
                }

                // Find the course in $questionsData
                foreach ($questionsData as &$courseData) {
                    if ($courseData['course_id'] == $courseId) {
                        // Check if the question type already exists
                        $typeExists = false;
                        foreach ($courseData['questions'] as &$questionType) {
                            if ($questionType['type'] == $typeKey) {
                                $typeExists = true;
                                // Update the corresponding difficulty count
                                $questionType['difficulty']["numOf{$difficulty}"] = (int)$value;
                                break;
                            }
                        }

                        // If the type doesn't exist, add it
                        if (!$typeExists) {
                            $courseData['questions'][] = [
                                'type' => $typeKey,
                                'difficulty' => [
                                    'numOfVeryEasy' => $difficulty == 'VeryEasy' ? (int)$value : 0,
                                    'numOfEasy' => $difficulty == 'Easy' ? (int)$value : 0,
                                    'numOfAverage' => $difficulty == 'Average' ? (int)$value : 0,
                                    'numOfHard' => $difficulty == 'Hard' ? (int)$value : 0,
                                    'numOfVeryHard' => $difficulty == 'VeryHard' ? (int)$value : 0,
                                ]
                            ];
                        }
                    }
                }
            }
        }
        $jsonContent = json_encode(array_values($questionsData), JSON_PRETTY_PRINT);
        $fastApiService->generateQuestions($jsonContent);

        // Step 5: Log the operation
        Log::info("Questions generated and sent to FastAPI successfully.");
    }
    protected function courseExists($questionsData, $courseIdToCheck) {
        $found = array_filter($questionsData, function ($course) use ($courseIdToCheck) {
            return $course['course_id'] === $courseIdToCheck;
        });
    
        return !empty($found); // Returns true if course_id exists, false otherwise
    }
}
