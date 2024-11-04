<?php

namespace App\Jobs;

use App\Services\FastApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $imageName;
    protected $parentModel;
    protected $type;

    public function __construct($imageName,$type, $parentModel)
    {
        $this->imageName = $imageName;
        $this->parentModel = $parentModel;
        $this->type = $type;
    }

    public function handle(FastApiService $fastApiService)
    {
        try {
            // // Get the full path to the image file
            $imageFullPath = Storage::path("public/{$this->type}/{$this->imageName}");

            // Call the FastAPI service to process the image
            $response = $fastApiService->getDescriptionFromImage($imageFullPath);

            if ($response && isset($response['text'])) {
                // Update the parent model with the description from the response
                $this->parentModel->update(['description' => $response['text']]);
                Log::info('Successfully processed image and updated description');
            } else {
                Log::error('Failed to get valid text from FastAPI response');
            }

        } catch (\Exception $e) {
            Log::error('Error processing image: ' . $e->getMessage());
        }
    }
    
}
