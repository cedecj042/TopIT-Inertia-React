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
    public function updating(Question $question)
    {
        // Check if 'test_type' is the only key that has changed
        if ($question->isDirty() && $question->isDirty('test_type') && !$question->isDirty(['another_attribute', 'yet_another_attribute'])) {
            // Here, you can log something or just return as updating FastAPI is not needed
            Log::info('Only test_type was changed, not updating FastAPI.');
            return;
        }
    
        // If other attributes have changed besides 'test_type', proceed with updating FastAPI
        $response = $this->fastAPIService->updateQuestion($question->question_uid, $question->toArray());
        if ($response->successful()) {
            Log::info('FastAPI update response: ' . $response->body());
        } else {
            Log::error('FastAPI update request failed: ' . $response->body());
        }
    }
    

}
