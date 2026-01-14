<?php

namespace App\Http\Controllers\Admin;

use App\Events\UploadEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PdfRequest;
use App\Jobs\ProcessPdfJob;
use App\Models\Course;
use App\Models\Pdf;
use App\Services\FastApiService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PdfController extends Controller
{
    protected $fastAPIService;

    public function __construct(FastApiService $fastAPIService)
    {
        $this->fastAPIService = $fastAPIService;
    }

    public function store(PdfRequest $request)
    {
        $validatedData = $request->validated();
        $course = Course::findOrFail($validatedData['course_id']);
        
        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');
            $fileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();

            $fileNameExist = Pdf::where('file_name', $fileName)->exists();
            if ($fileNameExist) {
                Log::error('File already exists: ' . $fileName);
                return redirect()->back()->withErrors(['error' => 'File already exists.']);
            }
            
            $uuid = Str::uuid()->toString();
            $storedFileName = $uuid . '.' . $extension;
            $filePath = $file->storeAs('', $storedFileName, 'pdfs');

            Log::info('File stored at: ' . $filePath);

            $pdf = $this->savePdfToDatabase($request, $fileName, $filePath);

            $fullPath = storage_path('app/pdfs/' . $storedFileName);
            if (!file_exists($fullPath)) {
                Log::error('File not found: ' . $fullPath);
                return redirect()->back()->withErrors(['error' => 'File could not be found after upload.']);
            }
            try {
                $pdfFilePath = $fullPath;
                ProcessPdfJob::dispatch($pdfFilePath, $fileName, $course->title, $course->course_id, $pdf->pdf_id);

                return redirect()->back()->with(['message' => 'PDF uploaded successfully! Processing will continue in the background.']);
            } catch (Exception $e) {
                Log::error('Error dispatching PDF processing job: ' . $e->getMessage());
                return redirect()->back()->withErrors(['error' => 'An error occurred while processing the PDF.']);
            }
        } else {
            Log::error('No file found in the request');
            return redirect()->back()->withErrors(['error' => 'No file was uploaded.']);
        }
    }
    private function savePdfToDatabase(Request $request, string $fileName, string $filePath)
    {
        $pdf = Pdf::create([
            'course_id' => $request->course_id,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'uploaded_by' => Auth::user()->userable->firstname . ' ' . Auth::user()->userable->lastname,
        ]);
        
        return $pdf;
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {
        \Log::info('Deleting PDF with ID: ' . $id);
        try {
            $pdf = Pdf::where('pdf_id', $id)->firstOrFail();	
            
            $this->deletePdfFile($pdf);
            // $this->deleteImagesViaFastAPI($pdf);

            $pdf->delete();
            return redirect()->back()->with(['success' => 'PDF and associated images deleted successfully']);

        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Something went wrong during deletion of pdf.']);

        }
    }

    private function deletePdfFile(Pdf $pdf)
    {
        $pdfPath = storage_path('app/' . $pdf->file_path);
        if (file_exists($pdfPath)) {
            unlink($pdfPath);
        }
    }

    private function deleteImagesViaFastAPI(Pdf $pdf)
    {
        $pdfName = pathinfo($pdf->file_name, PATHINFO_FILENAME);
        try {
            $response = $this->fastAPIService->deleteImages($pdfName);

            if ($response->successful()) {
                Log::info('FastAPI delete response: ' . $response->body());
            } else {
                Log::error('FastAPI delete request failed: ' . $response->body());
            }
        } catch (Exception $e) {
            Log::error('Error deleting images via FastAPI: ' . $e->getMessage());
        }
    }

}
