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

}
