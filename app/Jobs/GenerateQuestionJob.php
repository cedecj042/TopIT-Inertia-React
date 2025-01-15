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
        // Log the received data for debugging
        Log::info("Processing GenerateQuestionJob with data:", $this->requestData);

        // Prepare the JSON content to send to FastAPI
        $jsonContent = json_encode($this->requestData, JSON_PRETTY_PRINT);
        Log::info($jsonContent);

        // Send data to FastAPI
        $fastApiService->generateQuestions($jsonContent);

        // Log success
        Log::info("Questions successfully sent to FastAPI.");
    }
}
