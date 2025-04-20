<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'assessment_type_id' => $this->assessment_type_id,
            'type'=> $this->type,
            'total_questions'=>$this->total_questions,
            'evenly_distributed'=> $this->evenly_distributed,
            'created_at' => Carbon::parse($this->created_at)->format('F j, Y'), 
            'updated_at' => Carbon::parse($this->updated_at)->format('F j, Y'),
            'assessments' => AssessmentResource::collection($this->whenLoaded('assessments')), 
        ];
    }
}
