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

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($pdfFilePath, $fileName, $courseTitle, $courseId)
    {
        $this->pdfFilePath = $pdfFilePath;
        $this->fileName = $fileName;
        $this->courseTitle = $courseTitle;
        $this->courseId = $courseId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(FastAPIService $fastAPIService)
    {

        try {
            // Read the PDF content from the file
            $pdfContent = file_get_contents($this->pdfFilePath);
            $response = $fastAPIService->processPdf($pdfContent, $this->fileName, $this->courseTitle, $this->courseId);

            if ($response !== null && $response->successful()) {
                Log::info('FastAPI successfully processed the PDF. Response:', [
                    'status' => $response->status(),
                    'response_data' => $response->json(),
                ]);
            } else {
                Log::error('FastAPI request failed:', [
                    'status' => optional($response)->status(),
                    'response_body' => optional($response)->body(),
                ]);
            }
        } catch (\Exception $e) {
            // Log any exceptions that occur during the process
            Log::error('Error sending PDF to FastAPI: ' . $e->getMessage());
        }
    }
}
