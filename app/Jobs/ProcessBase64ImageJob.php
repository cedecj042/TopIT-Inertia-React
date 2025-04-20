<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use App\Models\Content;
use Exception;
use Illuminate\Support\Facades\Log;

class ProcessBase64ImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $base64Image;
    protected $content; // Directly use Content model instance
    protected $type;

    public function __construct($base64Image, Content $content, $type)
    {
        $this->base64Image = $base64Image;
        $this->content = $content;
        $this->type = $type;
    }

    public function handle()
    {
        try {
            $image = base64_decode($this->base64Image);
            $imageName = uniqid() . '.png';
            $folder = strtolower($this->type);

            // Save the image in the public disk
            Storage::disk('public')->put($folder . '/' . $imageName, $image);

            // Construct the relative path for public access
            $imagePath = "/storage/" . $folder . '/' . $imageName;

            // Update the content instance with the new file path
            $this->content->update([
                'file_name' => $imageName,
                'file_path' => $imagePath
            ]);
            $this->content->save();
        } catch (Exception $e) {
            Log::error('Failed to process base64 image', [
                'content' => $this->content->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
