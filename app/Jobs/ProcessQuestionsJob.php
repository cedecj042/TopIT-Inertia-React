<?php

namespace App\Jobs;

use App\Enums\QuestionDifficulty;
use App\Events\UploadEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Enums\QuestionDetailType;
use App\Enums\TestType;
use Exception;

class ProcessQuestionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $data;

    /**
     * Create a new job instance.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info('Processing questions asynchronously.');

        try{
            foreach ($this->data as $courseData) {
                Log::info('Processing course', [
                    'course_id' => $courseData['course_id'],
                    'course_title' => $courseData['course_title']
                ]);
    
                foreach ($courseData['questions'] as $qData) {
                    // Normalize difficulty name and check difficulty
                    $difficultyName = ucwords($qData['difficulty_type']); 
                    $questionDifficulty= $this->determineQuestionDifficulty($difficultyName);

                    // Determine the type of the question detail and difficulty using the enum
                    $questionDetailType = $this->determineQuestionDetailType($qData['questionType']);
                    // Process `answer`
                    $answer = $this->normalizeArray($qData['answer'] ?? []);
                    // Process `choices` only if present
                    $choices = $this->normalizeArray($qData['choices'] ?? []);

                    // Insert into question_details table
                    $questionDetailId = DB::table('question_details')->insertGetId([
                        'type' => $questionDetailType,
                        'answer' => json_encode($answer),
                        'choices' => !empty($choices) ? json_encode($choices) : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
    
                    // Insert into questions table with test_type as "Test"
                    DB::table('questions')->insert([
                        'course_id' => $courseData['course_id'],
                        'question_detail_id' => $questionDetailId,
                        'test_type' => TestType::TEST->value,
                        'question' => $qData['question'],
                        'discrimination_index' => $qData['discrimination_index'] ?? null,
                        'difficulty_value'=> $qData['difficulty_value'] ?? null,
                        'difficulty_type' => $questionDifficulty,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
    
            Log::info('Finished processing questions.');
            $this->broadcastEvent(null, "Successfully processed the question", null);
        }catch(Exception $e){
            Log::info("Error processing question: " . $e->getMessage());
            $this->broadcastEvent(null, null , "Error processed the question");
        }
    }

    /**
     * Normalize an array to handle both strings and nested arrays.
     *
     * @param mixed $data
     * @return array
     */
    private function normalizeArray($data): array|string{
        if (is_array($data)) {
            return array_map(function ($item) {
                // Handle nested arrays by extracting the first value
                return is_array($item) ? reset($item) : $item;
            }, $data);
        }
        // Return string directly if input is a string
        if (is_string($data)) {
            return $data;
        }
        return [];
    }
    /**
     * Determine the question detail type based on the `questionType`.
     *
     * @param string $questionType
     * @return string
     */
    private function determineQuestionDetailType(string $questionType): string
    {
        return match ($questionType) {
            'Identification' => QuestionDetailType::IDENTIFICATION->value,
            'Multiple Choice - Single' => QuestionDetailType::MULTIPLE_CHOICE_SINGLE->value,
            'Multiple Choice - Many' => QuestionDetailType::MULTIPLE_CHOICE_MANY->value,
            default => throw new \InvalidArgumentException("Unknown question type: $questionType"),
        };
    }
    private function determineQuestionDifficulty(string $difficultyType): string
    {
        return match ($difficultyType) {
            'Very Easy' => QuestionDifficulty::VERY_EASY->value,
            'Easy' => QuestionDifficulty::EASY->value,
            'Average' => QuestionDifficulty::AVERAGE->value,
            'Hard' => QuestionDifficulty::HARD->value,
            'Very Hard' => QuestionDifficulty::VERY_HARD->value,
            default => throw new \InvalidArgumentException("Unknown difficulty type: $difficultyType"),
        };
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
}
