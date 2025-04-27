<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Question;

class ReorderChoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reorder:choices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Shuffle and reorder the choices for all questions in the database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to reorder choices...');

        $questions = Question::whereNotNull('choices')->get();

        $count = 0;

        foreach ($questions as $question) {
            $choices = json_decode($question->choices, true);

            if (is_array($choices)) {
                shuffle($choices);
                $question->choices = json_encode(array_values($choices));
                $question->save();
                $count++;
            }
        }

        $this->info("Successfully reordered choices for {$count} questions.");
    }
}
