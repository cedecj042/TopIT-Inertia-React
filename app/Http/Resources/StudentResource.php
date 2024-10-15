<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_filter([
            'student_id' => $this->student_id,
            'name' => $this->name,
            'profile_image' => $this->profile_image,
            'birthdate' => $this->birthdate ? (new Carbon($this->birthdate))->format('Y-m-d') : null,
            'gender' => $this->gender,
            'address' => $this->address,
            'course' => $this->course,
            'school' => $this->school,
            'year' => $this->year,
            'age' => $this->age,
            'created_at'=> (new Carbon($this->created_at))->format('F j, Y ')
            
        ], function ($value) {
            return !is_null($value) && $value !== '';  // Remove null or empty string values
        });
    }
}
