<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'admin_id' =>$this->admin_id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'profile_image' => $this->profile_image,
            'last_login' =>$this->last_login
        ];
    }
}
