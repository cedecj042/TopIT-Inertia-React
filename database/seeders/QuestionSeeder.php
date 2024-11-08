<?php

namespace Database\Seeders;

use App\Enums\QuestionDetailType;
use App\Enums\QuestionType;
use App\Models\Identification;
use App\Models\MultiChoiceMany;
use App\Models\MultiChoiceSingle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        // Fetch all courses and difficulty levels
        $courses = DB::table('courses')->get();
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
            'Overview of System Architecture' => [
                ['What is system architecture?', 'The conceptual design of a system', ['The conceptual design of a system', 'A type of operating system', 'A network protocol', 'A physical server']],
                ['Which component is part of the system architecture?', 'Hardware', ['Hardware', 'Software licenses', 'Internet connection', 'Databases']],
                ['What does CPU stand for?', 'Central Processing Unit', ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Computer Programming Utility']],
                ['What is the role of an operating system in system architecture?', 'To manage hardware resources.', []],
                ['Select two common types of system architecture.', json_encode(['Client-server', 'Peer-to-peer']), ['Client-server', 'Peer-to-peer', 'Command-line', 'Mainframe']],
            ],
            'Understanding Information Security' => [
                ['What is information security?', 'Protection of information from unauthorized access', ['Protection of information from unauthorized access', 'A type of encryption', 'A programming language', 'A software license']],
                ['Name one type of encryption.', 'AES', []],
                ['Which of the following is an information security threat?', 'Phishing', ['Phishing', 'Spreadsheet', 'Firewall', 'Backup system']],
                ['What is the role of a firewall?', 'To protect a network by controlling incoming and outgoing traffic.', []],
                ['Select two methods used to secure information.', json_encode(['Encryption', 'Access Control']), ['Encryption', 'Access Control', 'Backup', 'Data Deletion']],
            ],
            'Understanding the IT Business and Ethics' => [
                ['What is business ethics?', 'The moral principles guiding business decisions', ['The moral principles guiding business decisions', 'A type of contract', 'A law about business', 'A corporate policy']],
                ['Name a principle of IT ethics.', 'Confidentiality', []],
                ['Which of the following is a business ethical issue?', 'Data privacy', ['Software design', 'Software updates', 'Data privacy', 'System architecture']],
                ['What is corporate social responsibility (CSR)?', 'A company’s responsibility to manage its business processes to produce an overall positive impact on society.', []],
                ['Select two ethical principles in IT.', json_encode(['Integrity', 'Accountability']), ['Integrity', 'Profitability', 'Accountability', 'Market share']],
            ],
            'Project Management & Technical Communication' => [
                ['What is project management?', 'The application of knowledge, skills, tools, and techniques to project activities', ['The application of knowledge, skills, tools, and techniques to project activities', 'The process of writing technical documents', 'The planning of software systems', 'The organization of a company']],
                ['Name a key phase in project management.', 'Planning', []],
                ['Which of the following is NOT a project management tool?', 'Python', ['Gantt chart', 'Critical Path Method', 'PERT chart', 'Python']],
                ['What is the purpose of technical communication in project management?', 'To clearly convey project goals, progress, and outcomes.', []],
                ['Select two common project management methodologies.', json_encode(['Agile', 'Waterfall']), ['Agile', 'Waterfall', 'Scrum', 'Test-driven development']],
            ]
        ];


        // Loop over each course
        foreach ($courses as $course) {
            if (isset($questions[$course->title])) {
                $courseQuestions = $questions[$course->title];
                
                foreach (['Very Easy', 'Easy', 'Average', 'Hard', 'Very Hard'] as $index => $difficultyName) {
                    $questionData = $courseQuestions[$index];
        
                    // Determine question detail type based on data structure
                    $type = empty($questionData[2])
                        ? QuestionDetailType::IDENTIFICATION->value
                        : (is_array(json_decode($questionData[1], true))
                            ? QuestionDetailType::MULTIPLE_CHOICE_MANY->value
                            : QuestionDetailType::MULTIPLE_CHOICE_SINGLE->value);
        
                    $difficulty_id = $difficulties[$difficultyName]->difficulty_id;
        
                    // Insert question details
                    $question_detail_id = DB::table('question_details')->insertGetId([
                        'type' => $type,
                        'answer' => json_encode($questionData[1]),
                        'choices' => !empty($questionData[2]) ? json_encode($questionData[2]) : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
        
                    // Insert question with QuestionType enum
                    DB::table('questions')->insert([
                        'course_id' => $course->course_id,
                        'question_detail_id' => $question_detail_id,
                        'difficulty_id' => $difficulty_id,
                        'question_type' => QuestionType::TEST->value,  // Use enum here for question type
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