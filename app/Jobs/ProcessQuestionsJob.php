<?php

namespace App\Jobs;

use App\Enums\QuestionDifficulty;
use App\Enums\QuestionType;
use App\Events\UploadEvent;
use App\Models\Question;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
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

        try {
            $questions = [];
            foreach ($this->data as $courseData) {
                Log::info('Processing course', [
                    'course_id' => $courseData['course_id'],
                    'course_title' => $courseData['course_title'],
                ]);
                foreach ($courseData['questions'] as $qData) {
                    $question_uid = $qData['question_uid'];
                    $difficultyName = ucwords($qData['difficulty_type']);
                    $questionDifficulty = $this->determineQuestionDifficulty($difficultyName);
                    $questionType = $this->determineQuestionType($qData['questionType']);
                    $answer = $this->normalizeArray($qData['answer'] ?? []);
                    $choices = $this->normalizeArray($qData['choices'] ?? []);

                    $questions[] = [
                        'question_uid' => $question_uid,
                        'course_id' => $courseData['course_id'],
                        'test_type' => TestType::TEST->value,
                        'question' => $qData['question'],
                        'discrimination_index' => $qData['discrimination_index'] ?? null,
                        'difficulty_value' => $qData['difficulty_value'] ?? null,
                        'difficulty_type' => $questionDifficulty,
                        'question_type' => $questionType,
                        'answer' => json_encode($answer),
                        'choices' => !empty($choices) ? json_encode($choices) : null,
                        'updated_at'=>now(),
                        'created_at'=> now()
                    ];
                }
            }
            if (!empty($questions)) {
                Question::insert($questions);
            }
            Log::info('Finished processing questions.');
            $this->broadcastEvent(null, "Successfully processed the question", null);
        } catch (Exception $e) {
            Log::info("Error processing question: " . $e->getMessage());
            $this->broadcastEvent(null, null, "Error processed the question");
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
                return is_array($item) ? reset($item) : $item;
            }, $data);
        }
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
    private function determineQuestionType(string $questionType)
    {
        return match ($questionType) {
            'Identification' => QuestionType::IDENTIFICATION->value,
            'Multiple Choice - Single' => QuestionType::MULTIPLE_CHOICE_SINGLE->value,
            'Multiple Choice - Many' => QuestionType::MULTIPLE_CHOICE_MANY->value,
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
