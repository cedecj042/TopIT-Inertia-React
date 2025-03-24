<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Services\FastAPIService;

class ProcessPdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $pdfFilePath;
    protected $fileName;
    protected string $courseTitle;
    protected int $courseId;
    protected int $pdfId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($pdfFilePath, $fileName, $courseTitle, $courseId,$pdfId)
    {
        $this->pdfFilePath = $pdfFilePath;
        $this->fileName = $fileName;
        $this->courseTitle = $courseTitle;
        $this->courseId = $courseId;
        $this->pdfId = $pdfId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(FastAPIService $fastAPIService)
    {
        try {
            // Ensure the file exists before processing
            if (!file_exists($this->pdfFilePath)) {
                throw new \Exception("PDF file does not exist: {$this->pdfFilePath}");
            }
        
            $pdfContent = file_get_contents($this->pdfFilePath);
        
            if ($pdfContent === false) {
                throw new \Exception("Failed to read content from: {$this->pdfFilePath}");
            }
        
            $response = $fastAPIService->processPdf($pdfContent, $this->fileName, $this->courseTitle, $this->courseId, $this->pdfId);
        
            if ($response && $response->successful()) {
                Log::info('FastAPI successfully processed the PDF.', [
                    'status' => $response->status(),
                    'response_data' => $response->json(),
                ]);
            } else {
                Log::error('FastAPI request failed.', [
                    'status' => optional($response)->status(),
                    'response_body' => optional($response)->body(),
                ]);
        
                // Optionally, re-throw the exception if you want the job to retry
                throw new \Exception("FastAPI request failed with status: " . optional($response)->status());
            }
        } catch (\Exception $e) {
            Log::error('Error processing PDF in job: ' . $e->getMessage(), [
                'stack_trace' => $e->getTraceAsString(),
            ]);
        
            // Optionally fail the job or retry
            $this->fail($e);
        }
        
    }
}
