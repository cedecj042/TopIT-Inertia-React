<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Course::create([
            'title' => 'Software Development',
            'description' => 'This course covers the fundamentals of software development methodologies and processes.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Course::create([
            'title' => 'Understanding and Using Data',
            'description' => 'This course provides an overview of data analysis and manipulation techniques.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Course::create([
            'title' => 'Overview of System Architecture',
            'description' => 'Learn the key concepts of system architecture, including hardware and software components.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Course::create([
            'title' => 'Understanding Information Security',
            'description' => 'This course focuses on the principles and practices of securing information systems.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Course::create([
            'title' => 'Understanding the IT Business and Ethics',
            'description' => 'Explore the relationship between IT, business operations, and ethical considerations.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        Course::create([
            'title' => 'Project Management & Technical Communication',
            'description' => 'This course covers project management principles and effective technical communication strategies.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}