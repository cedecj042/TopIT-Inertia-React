<?php

namespace App\Observers;

use App\Models\Question;
use App\Services\FastApiService;
use Log;

class QuestionObserver
{
    protected $fastAPIService;
    public function __construct(FastApiService $fastAPIService)
    {
        $this->fastAPIService = $fastAPIService;
    }
    public function deleting(Question $question)
    {
        $response = $this->fastAPIService->deleteQuestion($question->question_uid);
        if ($response->successful()) {
            Log::info('FastAPI delete response: ' . $response->body());
        } else {
            Log::error('FastAPI delete request failed: ' . $response->body());
        }
    }
    
    // public function updating(Question $question)
    // {
    //     if (
    //         $question->isDirty() &&
    //         !$question->isDirty([
    //             'course_id',
    //             'difficulty_type',
    //             'difficulty_value',
    //             'discrimination_index',
    //             'question_type',
    //             'question'
    //         ])
    //     ) {
    //         Log::info('Only non-critical fields changed, not updating FastAPI.', [
    //             'dirty_fields' => $question->getDirty()
    //         ]);
    //         return;
    //     }

    //     $data = $question->makeHidden(['course'])->toArray();
    //     $data['choices'] = json_decode($data['choices'], true);
    //     $data['answer'] = json_decode($data['answer'], true);
    //     Log::info('Updating question in FastAPI', [
    //         'question_uid' => $question->question_uid,
    //         'data' => $data
    //     ]);

    //     // If other attributes have changed besides 'test_type', proceed with updating FastAPI
    //     $response = $this->fastAPIService->updateQuestion($question->question_uid, $data);
    //     if ($response->successful()) {
    //         Log::info('FastAPI update response: ' . $response->body());
    //     } else {
    //         Log::error('FastAPI update request failed: ' . $response->body());
    //     }
    // }


}
