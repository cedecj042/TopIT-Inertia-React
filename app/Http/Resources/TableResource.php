<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TableResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'table_id' => $this->table_id,
            'caption' => $this->caption,
            'order' => $this->order,
            'description'=> $this->description,
            'images' => ImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
