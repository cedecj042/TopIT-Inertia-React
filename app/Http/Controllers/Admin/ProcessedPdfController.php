<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PdfStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessContentRequest;
use App\Jobs\ProcessModuleJob;
use App\Models\Pdf;
use Illuminate\Support\Facades\Bus;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessedPdfController extends Controller
{
    public function store(ProcessContentRequest $request)
    {
        $validated = $request->validated();
        $course_id = $validated['course_id'];
        $fileName = $validated['file_name'];
        $modules = $validated['processed_data']['Modules'];

        $jobs = collect($modules)->map(function ($moduleData) use ($course_id) {
            return new ProcessModuleJob($moduleData, $course_id);
        })->all();

        $batch = Bus::batch($jobs)
            ->then(function (Batch $batch) use ($course_id, $fileName) {
                // Update the PDF status to SUCCESS upon successful processing of all jobs
                $this->updatePdfStatus(PdfStatus::SUCCESS, $course_id, $fileName);
            })
            ->catch(function (Throwable $e) use ($course_id, $fileName) {
                // Update the PDF status to FAILED if any job fails
                Log::error("Error processing batch: {$e->getMessage()}");
                $this->updatePdfStatus(PdfStatus::FAILED, $course_id, $fileName);
            })
            ->finally(function () {
                Log::info("Batch processing of modules completed.");
            })
            ->dispatch();

        

        return response()->json(['message' => 'Batch processing started for modules.']);
    }

    private function updatePdfStatus(PdfStatus $status, $course_id, $file_name)
    {
        $pdf = Pdf::where('course_id', $course_id)
            ->where('file_name', $file_name)
            ->first();
        if ($pdf) {
            $pdf->status = $status->value;
            $pdf->save();
            Log::info('PDF processing status updated', ['status' => $status->name, 'file_name' => $file_name]);
        }
    }
    // private function updatePdfProgress($progress, $course_id, $file_name) {
    //     broadcast(new ProgressUpdated($progress, $course_id, $file_name));
    // }
}
