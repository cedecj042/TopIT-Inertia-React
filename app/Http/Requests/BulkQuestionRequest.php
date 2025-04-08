<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkQuestionRequest extends FormRequest
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
