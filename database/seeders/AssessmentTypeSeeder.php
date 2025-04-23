<?php

namespace Database\Seeders;

use App\Models\AssessmentType;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssessmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AssessmentType::insert([
            [
                'type' => 'Pretest',
                'total_questions' => 15,
                'evenly_distributed' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'type' => 'Test',
                'total_questions' => 10,
                'evenly_distributed' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
