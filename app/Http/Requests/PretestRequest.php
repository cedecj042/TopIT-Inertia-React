<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PretestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'questions' => 'required|array', 
        ];
    }
}
