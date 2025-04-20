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

class GenerateQuestionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $requestData;

    /**
     * Create a new job instance.
     *
     * @param array $requestData Formatted and validated input data.
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
        Log::info("Processing GenerateQuestionJob with data:", $this->requestData);
        $jsonContent = json_encode($this->requestData, JSON_PRETTY_PRINT);
        $fastApiService->generateQuestions($jsonContent);

        Log::info("Questions successfully sent to FastAPI.");
    }
}
