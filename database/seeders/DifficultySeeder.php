<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DifficultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('difficulty')->insert([
            [
                'name' => 'Very Easy',
                'numeric' => -3.0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Easy',
                'numeric' => -1.5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Average',
                'numeric' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Hard',
                'numeric' => 1.5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Very Hard',
                'numeric' => 3.0,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}