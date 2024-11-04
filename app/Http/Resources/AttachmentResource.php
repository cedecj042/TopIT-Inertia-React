<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'attachment_id' => $this->attachment_id,
            'type'=>$this->type,
            'description' =>$this->description,
            'caption' =>$this->caption,
            'order'=>$this->order,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path,
            'created_at' => (new Carbon($this->created_at))->format('F d, Y'), // Optional: Format the date
            'updated_at' => (new Carbon(time: $this->updated_at))->format('F d, Y'),
        ];
    }
}
