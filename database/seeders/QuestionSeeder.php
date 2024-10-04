<?php

namespace Database\Seeders;

use App\Models\Identification;
use App\Models\MultiChoiceMany;
use App\Models\MultiChoiceSingle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        // Fetch all courses
        $courses = DB::table('courses')->get();

        // Fetch all difficulty levels
        $difficulties = DB::table('difficulty')->get()->keyBy('name');

        $questions = [
            'Software Development' => [
                ['What is the Waterfall Model?', 'A traditional software development model', ['A traditional software development model', 'An Agile model', 'A type of architecture', 'A database design methodology']],
                ['Name a type of Agile methodology.', 'Scrum', ['Scrum', 'Kanban', 'Waterfall', 'Extreme Programming']],
                ['Which of the following is NOT a software development lifecycle?', 'Quantum', ['Waterfall', 'Agile', 'V-Model', 'Quantum']],
                ['What is the purpose of version control in software development?', 'To track and manage changes to code.', []],
                ['Name two commonly used programming languages.', json_encode(['Java', 'Python']), ['Java', 'Python', 'C#', 'Swift']],
            ],
            'Understanding and Using Data' => [
                ['What is a database?', 'A structured set of data', ['A structured set of data', 'A programming language', 'A software application', 'An algorithm']],
                ['What is the primary purpose of data analysis?', 'To make informed decisions.', []],
                ['Which of the following is a data analysis tool?', 'Excel', ['Excel', 'Java', 'Photoshop', 'Word']],
                ['What does ETL stand for?', 'Extract, Transform, Load', ['Extract, Transform, Load', 'Encode, Transfer, Launch', 'Edit, Test, Learn', 'Examine, Tally, List']],
                ['Select all the steps in the data analysis process.', json_encode(['Collecting data', 'Cleaning data']), ['Collecting data', 'Cleaning data', 'Writing code', 'Testing models']],
            ],
            // 'Overview of System Architecture' => [
            //     ['What is system architecture?', 'The conceptual design of a system', ['The conceptual design of a system', 'A type of operating system', 'A network protocol', 'A physical server']],
            //     ['Which component is part of the system architecture?', 'Hardware', ['Hardware', 'Software licenses', 'Internet connection', 'Databases']],
            //     ['What does CPU stand for?', 'Central Processing Unit', ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Computer Programming Utility']],
            //     ['What is the role of an operating system in system architecture?', 'To manage hardware resources.', []],
            //     ['Select two common types of system architecture.', json_encode(['Client-server', 'Peer-to-peer']), ['Client-server', 'Peer-to-peer', 'Command-line', 'Mainframe']],
            // ],
            // 'Understanding Information Security' => [
            //     ['What is information security?', 'Protection of information from unauthorized access', ['Protection of information from unauthorized access', 'A type of encryption', 'A programming language', 'A software license']],
            //     ['Name one type of encryption.', 'AES', []],
            //     ['Which of the following is an information security threat?', 'Phishing', ['Phishing', 'Spreadsheet', 'Firewall', 'Backup system']],
            //     ['What is the role of a firewall?', 'To protect a network by controlling incoming and outgoing traffic.', []],
            //     ['Select two methods used to secure information.', json_encode(['Encryption', 'Access Control']), ['Encryption', 'Access Control', 'Backup', 'Data Deletion']],
            // ],
            // 'Understanding the IT Business and Ethics' => [
            //     ['What is business ethics?', 'The moral principles guiding business decisions', ['The moral principles guiding business decisions', 'A type of contract', 'A law about business', 'A corporate policy']],
            //     ['Name a principle of IT ethics.', 'Confidentiality', []],
            //     ['Which of the following is a business ethical issue?', 'Data privacy', ['Software design', 'Software updates', 'Data privacy', 'System architecture']],
            //     ['What is corporate social responsibility (CSR)?', 'A company’s responsibility to manage its business processes to produce an overall positive impact on society.', []],
            //     ['Select two ethical principles in IT.', json_encode(['Integrity', 'Accountability']), ['Integrity', 'Profitability', 'Accountability', 'Market share']],
            // ],
            // 'Project Management & Technical Communication' => [
            //     ['What is project management?', 'The application of knowledge, skills, tools, and techniques to project activities', ['The application of knowledge, skills, tools, and techniques to project activities', 'The process of writing technical documents', 'The planning of software systems', 'The organization of a company']],
            //     ['Name a key phase in project management.', 'Planning', []],
            //     ['Which of the following is NOT a project management tool?', 'Python', ['Gantt chart', 'Critical Path Method', 'PERT chart', 'Python']],
            //     ['What is the purpose of technical communication in project management?', 'To clearly convey project goals, progress, and outcomes.', []],
            //     ['Select two common project management methodologies.', json_encode(['Agile', 'Waterfall']), ['Agile', 'Waterfall', 'Scrum', 'Test-driven development']],
            // ]
        ];


        // Loop over each course
        foreach ($courses as $course) {
            if (isset($questions[$course->title])) {
                $courseQuestions = $questions[$course->title];
        
                // Loop through questions for the current course
                foreach (['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard'] as $index => $difficultyName) {
                    $questionData = $courseQuestions[$index];
        
                    // Insert identification or multiple choice questions
                    if (empty($questionData[2])) {
                        // Insert identification type
                        DB::table('identifications')->insert([
                            'name' => "Identification",
                            'answer' => $questionData[1],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                        $identification_id = DB::getPdo()->lastInsertId();
        
                        DB::table('questions')->insert([
                            'course_id' => $course->course_id,
                            'questionable_id' => $identification_id,
                            'questionable_type' => Identification::class,
                            'difficulty_id' => $difficulties[$difficultyName]->difficulty_id,
                            'question' => $questionData[0],
                            'discrimination_index' => rand(-1, 1),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    } else {
                        // Insert multiple choice single or many
                        $choices = json_encode($questionData[2]);
        
                        // If the answer is not an array, assume it's a single-choice question
                        if (!is_array(json_decode($questionData[1], true))) {
                            // Single choice
                            DB::table('multichoice_single')->insert([
                                'name' => "Multiple Choice Single",
                                'answer' => $questionData[1],
                                'choices' => $choices,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                            $multichoice_single_id = DB::getPdo()->lastInsertId();
        
                            DB::table('questions')->insert([
                                'course_id' => $course->course_id,
                                'questionable_id' => $multichoice_single_id,
                                'questionable_type' => MultiChoiceSingle::class,
                                'difficulty_id' => $difficulties[$difficultyName]->difficulty_id,
                                'question' => $questionData[0],
                                'discrimination_index' => rand(-1, 1),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        } else {
                            // Multiple choice many (answer is an array)
                            DB::table('multichoice_many')->insert([
                                'name' => "Multiple Choice Many",
                                'answer' => $questionData[1], // answers are already encoded
                                'choices' => $choices,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                            $multichoice_many_id = DB::getPdo()->lastInsertId();
        
                            DB::table('questions')->insert([
                                'course_id' => $course->course_id,
                                'questionable_id' => $multichoice_many_id,
                                'questionable_type' => MultiChoiceMany::class,
                                'difficulty_id' => $difficulties[$difficultyName]->difficulty_id,
                                'question' => $questionData[0],
                                'discrimination_index' => rand(-1, 1),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }        
    }
}