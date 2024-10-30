<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'image_id' => $this->image_id,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path, // The URL path to the image
            'created_at' => $this->created_at->format('F d, Y'), // Optional: Format the date
            'updated_at' => $this->updated_at->format('F d, Y'),
        ];
    }
}
