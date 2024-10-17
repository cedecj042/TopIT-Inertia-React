<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessContentJob;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProcessedPdfController extends Controller
{
    //
    public function store(Request $request){
        $validated = $request->validated();
        try{
            ProcessContentJob::dispatch($validated['course_id'],$validated['processed_data']);
        }catch(Exception $e){
            Log::error('Error processing content:', ['exception' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error'=>'Failed to process content. Please try again.']);
        }
    }
}
