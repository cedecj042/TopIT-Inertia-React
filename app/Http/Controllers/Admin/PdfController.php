<?php

namespace App\Http\Controllers\Admin;

use App\Events\UploadEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\PdfRequest;
use App\Http\Requests\ProcessContentRequest;
use App\Jobs\ProcessContentJob;
use App\Jobs\ProcessPdfJob;
use App\Models\Course;
use App\Models\Pdf;
use App\Services\FastApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            $filePath = $file->storeAs('', $fileName, 'pdfs');
        
            Log::info('File stored at: ' . $filePath);

            $pdf = $this->savePdfToDatabase($request, $fileName, $filePath);

            $fullPath = storage_path('app/pdfs/' . $fileName);
            if (!file_exists($fullPath)) {
                Log::error('File not found: ' . $fullPath);
                return redirect()->back()->withErrors(['error' => 'File could not be found after upload.']);
            }
            try {
                $pdfFilePath = $fullPath;
                ProcessPdfJob::dispatch($pdfFilePath, $fileName, $course->title, $course->course_id);
            
                return redirect()->back()->with(['success'=>'PDF uploaded successfully! Processing will continue in the background.']);
            } catch (\Exception $e) {
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
            'status' => 'Uploading',
            'uploaded_by' => Auth::user()->userable->firstname . ' ' . Auth::user()->userable->lastname,
        ]);

        Log::info('PDF saved to database: ', $pdf->toArray());

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
    public function destroy(string $id)
    {
        //
    }
    public function process(PdfRequest $request){
        
        $validatedData= $request->validated();
        try {
            ProcessContentJob::dispatch($validatedData['course_id']);
            Log::error('PDF processing');
            return redirect()->back()->with(['message' => 'PDF processing started.'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to start PDF processing', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['message' => 'Failed to start PDF processing', 'error' => $e->getMessage()], 500);
        }
    }

}