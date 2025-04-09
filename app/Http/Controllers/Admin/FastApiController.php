<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PdfStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessContentRequest;
use App\Jobs\ProcessModuleJob;
use App\Jobs\ProcessQuestionsJob;
use App\Models\Module;
use App\Models\Pdf;
use Bus;
use DB;
use Illuminate\Bus\Batch;
use Illuminate\Http\Request;
use Log;
use Throwable;

class FastApiController extends Controller
{
    //
    public function storeProcessedPdf(ProcessContentRequest $request)
    {
        $validated = $request->validated();
        $course_id = $validated['course_id'];
        $pdf_id = $validated['pdf_id'];
        $modules = $validated['processed_data']['Modules'];

        $jobs = collect($modules)->map(function ($moduleData) use ($course_id) {
            return new ProcessModuleJob($moduleData, $course_id);
        })->all();

        $batch = Bus::batch($jobs)
            ->then(function (Batch $batch) use ($course_id, $pdf_id) {
                // Update the PDF status to SUCCESS upon successful processing of all jobs
                $this->updatePdfStatus(PdfStatus::SUCCESS, $course_id, $pdf_id);
            })
            ->catch(function (Throwable $e) use ($course_id, $pdf_id) {
                // Update the PDF status to FAILED if any job fails
                Log::error("Error processing batch: {$e->getMessage()}");
                $this->updatePdfStatus(PdfStatus::FAILED, $course_id, $pdf_id);
            })
            ->finally(function () {
            })
            ->dispatch();

        return response()->json(['message' => 'Batch processing started for modules.'], 201);
    }

    private function updatePdfStatus(PdfStatus $status, $course_id, $pdf_id)
    {
        $pdf = Pdf::findOrFail($pdf_id);
        if ($pdf) {
            $pdf->status = $status->value;
            $pdf->save();
        } else {
            Log::warning('PDF not found', ['course_id' => $course_id, 'file_name' => $pdf_id]);
        }
    }


    public function storeProcessedQuestion(Request $request)
    {
        $data = $request->json()->all();
        ProcessQuestionsJob::dispatch($data);
        return redirect()->back()->with('success', 'Deleted Successfully');
    }

    public function updateModuleStatus(Request $request)
    {
        $validated = $request->validate([
            'module_uids' => 'required|array',
        ]);

        foreach ($validated['module_uids'] as $moduleUid) {
            $module = Module::where('module_uid',$moduleUid)->first();
            if ($module) {
                $module->vectorized = true;
                $module->save();
                Log::info("Module ID {$moduleUid} marked as vectorized.");
            } else {
                Log::warning("Module ID {$moduleUid} not found.");
            }
        }

        return response()->json(['message' => 'Modules updated successfully'], 200);
    }
}
