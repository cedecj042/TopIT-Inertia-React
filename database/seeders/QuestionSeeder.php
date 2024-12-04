<?php

namespace Database\Seeders;

use App\Enums\QuestionDetailType;
use App\Enums\QuestionDifficulty;
use App\Enums\QuestionTestType;
use App\Enums\TestType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        // Fetch all courses and difficulty levels
        $courses = DB::table('courses')->get();
        $difficulties = QuestionDifficulty::cases();

        $questions = [
            'Software Development' => [
                ['What is the Waterfall Model?', 'A traditional software development model', ['A traditional software development model', 'An Agile model', 'A type of architecture', 'A database design methodology']],
                ['Name a type of Agile methodology.', 'Scrum', ['Scrum', 'Kanban', 'Waterfall', 'Extreme Programming']],
                ['Which of the following is NOT a software development lifecycle?', 'Quantum', ['Waterfall', 'Agile', 'V-Model', 'Quantum']],
                ['What is the process of breaking down a complex problem into smaller subproblems?', ['Decomposition'], []],
                ['Name two commonly used programming languages.', ['Java', 'Python'], ['Java', 'Python', 'C#', 'Swift']],
            ],
            'Understanding and Using Data' => [
                ['What is a database?', 'A structured set of data', ['A structured set of data', 'A programming language', 'A software application', 'An algorithm']],
                ['What methodology emphasizes customer feedback and iterative development?', ['Agile','Agile Methodology'], []],
                ['Which of the following is a data analysis tool?', 'Excel', ['Excel', 'Java', 'Photoshop', 'Word']],
                ['What does ETL stand for?', 'Extract, Transform, Load', ['Extract, Transform, Load', 'Encode, Transfer, Launch', 'Edit, Test, Learn', 'Examine, Tally, List']],
                ['Select all the steps in the data analysis process.', ['Collecting data', 'Cleaning data'], ['Collecting data', 'Cleaning data', 'Writing code', 'Testing models']],
            ],
            'Overview of System Architecture' => [
                ['What is system architecture?', 'The conceptual design of a system', ['The conceptual design of a system', 'A type of operating system', 'A network protocol', 'A physical server']],
                ['Which component is part of the system architecture?', 'Hardware', ['Hardware', 'Software licenses', 'Internet connection', 'Databases']],
                ['What does CPU stand for?', 'Central Processing Unit', ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Computer Programming Utility']],
                ['What is responsible for managing hardware resources in system architecture?', ['Operating system','OS'], []],
                ['Select two common types of system architecture.', ['Client-server', 'Peer-to-peer'], ['Client-server', 'Peer-to-peer', 'Command-line', 'Mainframe']],
            ],
            'Understanding Information Security' => [
                ['What is information security?', 'Protection of information from unauthorized access', ['Protection of information from unauthorized access', 'A type of encryption', 'A programming language', 'A software license']],
                ['In the context of software development, what term describes the practice of merging different code changes into a shared repository?', ['Continuous Integration','CI'], []],
                ['Which of the following is an information security threat?', 'Phishing', ['Phishing', 'Spreadsheet', 'Firewall', 'Backup system']],
                ['What is the tern that protect a network by controlling incoming and outgoing traffic?', ['Firewall'], []],
                ['Select two methods used to secure information.', ['Encryption', 'Access Control'], ['Encryption', 'Access Control', 'Backup', 'Data Deletion']],
            ],
            'Understanding the IT Business and Ethics' => [
                ['What is business ethics?', 'The moral principles guiding business decisions', ['The moral principles guiding business decisions', 'A type of contract', 'A law about business', 'A corporate policy']],
                ['What model in software engineering outlines the sequential phases of requirement analysis, design, implementation, testing, and maintenance?', ["Waterfall Model"], []],
                ['Which of the following is a business ethical issue?', 'Data privacy', ['Software design', 'Software updates', 'Data privacy', 'System architecture']],
                ['This term means a company’s responsibility to manage its business processes to produce an overall positive impact on society.', ["corporate social responsibility","CSR"], []],
                ['Select two ethical principles in IT.', ['Integrity', 'Accountability'], ['Integrity', 'Profitability', 'Accountability', 'Market share']],
            ],
            'Project Management & Technical Communication' => [
                ['What is project management?', 'The application of knowledge, skills, tools, and techniques to project activities', ['The application of knowledge, skills, tools, and techniques to project activities', 'The process of writing technical documents', 'The planning of software systems', 'The organization of a company']],
                ['Which of the following is NOT a project management tool?', 'Python', ['Gantt chart', 'Critical Path Method', 'PERT chart', 'Python']],
                ['Select two common project management methodologies.', ['Agile', 'Waterfall'], ['Agile', 'Waterfall', 'Scrum', 'Test-driven development']],
                ['What term describes the process of identifying and analyzing potential issues that could negatively impact a project?', ['Risk Management'], []],
                ['What is the term for a visual representation of a project schedule that shows the start and finish dates of the various elements of a project?', ['Gantt Chart'], []],
            ]
        ];


        // Define difficulty value ranges
        $difficultyRanges = [
            QuestionDifficulty::VERY_EASY->value => [-5, -3],
            QuestionDifficulty::EASY->value => [-3, -1],
            QuestionDifficulty::AVERAGE->value => [-1, 1],
            QuestionDifficulty::HARD->value => [1, 3],
            QuestionDifficulty::VERY_HARD->value => [3, 5],
        ];

        foreach ($courses as $course) {
            if (isset($questions[$course->title])) {
                $courseQuestions = $questions[$course->title];

                foreach ($difficulties as $index => $difficulty) {
                    $difficultyName = $difficulty->value;

                    // Ensure questions exist for the difficulty level
                    if (isset($courseQuestions[$index])) {
                        $questionData = $courseQuestions[$index];

                        // Determine question detail type
                        $type = empty($questionData[2])
                            ? QuestionDetailType::IDENTIFICATION->value
                            : (is_array($questionData[1])
                                ? QuestionDetailType::MULTIPLE_CHOICE_MANY->value
                                : QuestionDetailType::MULTIPLE_CHOICE_SINGLE->value);

                        // Insert question details
                        $question_detail_id = DB::table('question_details')->insertGetId([
                            'type' => $type,
                            'answer' => json_encode($questionData[1]),
                            'choices' => !empty($questionData[2]) ? json_encode($questionData[2]) : null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        // Generate difficulty value within the specified range
                        $difficultyRange = $difficultyRanges[$difficultyName];
                        $difficultyValue = mt_rand($difficultyRange[0] * 10, $difficultyRange[1] * 10) / 10;

                        // Generate discrimination index (0.5 to 2.0)
                        $discriminationIndex = mt_rand(50, 200) / 100;

                        // Insert question
                        DB::table('questions')->insert([
                            'course_id' => $course->course_id,
                            'question_detail_id' => $question_detail_id,
                            'difficulty_type' => $difficultyName,
                            'test_type' => TestType::TEST->value,
                            'question' => $questionData[0],
                            'discrimination_index' => $discriminationIndex,
                            'difficulty_value' => $difficultyValue,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}