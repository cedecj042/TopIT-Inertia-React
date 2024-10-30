<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubsectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'subsection_id' =>$this->subsection_id,
            'title' => $this->title,
            'content' => $this->content,
            'created_at' => (new Carbon($this->created_at))->format('F d, Y'),
            'section' => new SectionResource($this->whenLoaded('section')),
            'tables' => TableResource::collection($this->whenLoaded('tables')),
            'figures' => FigureResource::collection($this->whenLoaded('figures')),
            'codes' => CodeResource::collection($this->whenLoaded('codes')),
        ];
    }
}
