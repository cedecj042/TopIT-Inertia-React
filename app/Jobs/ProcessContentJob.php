<?php

namespace App\Jobs;

use App\Events\UploadEvent;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Pdf;
use App\Models\Section;
use App\Models\Subsection;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessContentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $processed_data;
    protected $course_id;
    protected $file_name;
    /**
     * Create a new job instance.
     */
    public function __construct($course_id,$processed_data,$file_name)
    {
        $this->processed_data = $processed_data;
        $this->course_id=$course_id;
        $this->file_name=$file_name;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {

        DB::beginTransaction();

        try {
            
            foreach ($this->processed_data['Modules'] as $moduleData) {
                Log::info('Processing module', ['module_title' => $moduleData['Title']]);

                $module = Module::create([
                    'course_id' => $this->course_id,
                    'title' => $moduleData['Title'],
                    'content' => json_encode($moduleData['Content'])
                ]);

                foreach ($moduleData['Lessons'] as $lessonData) {
                    Log::info('Processing lesson', ['lesson_title' => $lessonData['Title']]);

                    $lesson = Lesson::create([
                        'module_id' => $module->module_id,
                        'title' => $lessonData['Title'],
                        'content' => json_encode($lessonData['Content'])
                    ]);

                    foreach ($lessonData['Sections'] as $sectionData) {
                        $sectionTitle = $sectionData['Title'];
                        Log::info('Processing section', [
                            'section_title' => $sectionTitle,
                            'section_content' => $sectionData['Content']
                        ]);

                        $section = Section::create([
                            'lesson_id' => $lesson->lesson_id,
                            'title' => $sectionTitle,
                            'content' => json_encode($sectionData['Content']),
                        ]);

                        $contentTypes = ['Tables', 'Figures', 'Codes'];

                        foreach ($contentTypes as $contentType) {
                            // Check if the content type exists in the current section and is an array
                            if (isset($sectionData[$contentType]) && is_array($sectionData[$contentType])) {
                                foreach ($sectionData[$contentType] as $item) {
                                    if (is_array($item) && isset($item['type'])) {
                                        $this->processContent($item, $section);
                                    }
                                }
                            }
                        }

                        foreach ($sectionData['Subsections'] as $subsectionData) {
                            $subsectionTitle = $subsectionData['Title'];
                            Log::info('Processing subsection', [
                                'subsection_title' => $subsectionTitle,
                                'subsection_content' => $subsectionData['Content']
                            ]);

                            $subsection = Subsection::create([
                                'section_id' => $section->section_id,
                                'title' => $subsectionTitle,
                                'content' => json_encode($subsectionData['Content'])
                            ]);

                            $contentTypes = ['Tables', 'Figures', 'Codes'];

                            foreach ($contentTypes as $contentType) {
                                // Check if the content type exists in the current section and is an array
                                if (isset($subsectionData[$contentType]) && is_array($subsectionData[$contentType])) {
                                    foreach ($subsectionData[$contentType] as $item) {
                                        if (is_array($item) && isset($item['type'])) {
                                            $this->processContent($item, $subsection);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();

            $pdf = Pdf::where('course_id', $this->course_id)
                ->where('file_name', $this->file_name)
                ->firstOrFail();
            $pdf->status = 'Done';
            $pdf->save();
            $this->broadcastEvent(null,"Successfully processed the PDF",null);
            Log::info('Successfully stored processed PDF data');
            return response()->json(['message' => 'Processed PDF data stored successfully'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            $this->broadcastEvent(null,null,"Failed to process PDF data");
            Log::error('Failed to store processed PDF data', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to store processed PDF data', 'error' => $e->getMessage()], 500);
        }
    }

    private function processContent($contentItem, $parent)
    {
        // Check if the content type is Figures, Tables, or Code
        $contentData = [
            'image_base64' => $contentItem['image_base64'] ?? null,
            'coordinates' => $contentItem['coordinates'] ?? null,
            'caption' => $contentItem['before_caption'] ?? $contentItem['after_caption'] ?? "",
            'order' => isset($contentItem['order']) ? (int) $contentItem['order'] : null,
        ];
        Log::info('Processing content item', ['contentData' => $contentData['caption']]);
        // Call the appropriate processing function
        switch ($contentItem['type']) {
            case 'Figures':
                $this->processFigures($contentData, $parent);
                break;
            case 'Tables':
                $this->processTables($contentData, $parent);
                break;
            case 'Code':
                $this->processCode($contentData, $parent);
                break;
        }

    }

    private function processTables($data, $parent)
    {

        $table = $parent->tables()->create($data);

        if (isset($data['image_base64'])) {
            $imagePath = $this->storeBase64Image($data['image_base64'], 'tables/', $table);
            ProcessImageJob::dispatch($imagePath, 'tables', $table);
        }

        return $table;
    }

    private function processFigures($data, $parent)
    {

        $figure = $parent->figures()->create($data);

        if (isset($data['image_base64'])) {
            $imagePath = $this->storeBase64Image($data['image_base64'], 'figures/', $figure);
            ProcessImageJob::dispatch($imagePath, 'figures', $figure);
        }

        return $figure;
    }

    private function processCode($data, $parent)
    {

        $code = $parent->codes()->create($data);

        if (isset($data['image_base64'])) {
            $imagePath = $this->storeBase64Image($data['image_base64'], 'code/', $code);

            // Dispatch the ProcessImageJob to generate the description asynchronously
            ProcessImageJob::dispatch($imagePath, 'code', $code);
        }

        return $code;
    }

    private function storeBase64Image($base64Image, $folder, $parentModel)
    {
        $image = base64_decode($base64Image);
        $imageName = uniqid() . '.png';

        $disk = match ($folder) {
            'figures/' => 'figures',
            'tables/' => 'tables',
            'code/' => 'code',
            default => 'public',
        };

        // Store the image in the file system
        Storage::disk($disk)->put($imageName, $image);

        // Save the image details in the database
        $imagePath = Storage::disk($disk)->url($imageName);
        $parentModel->images()->create([
            'file_name' => $imageName,
            'file_path' => $imagePath,
        ]);

        return $imageName;
    }
    public function broadcastEvent($info=null,$success=null,$error=null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info,$success,$error));
        Log::info('Event broadcasted');
    }
}
