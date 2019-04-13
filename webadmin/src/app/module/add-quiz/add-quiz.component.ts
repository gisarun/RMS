import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { CourseService } from '../../services/restservices/course.service';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']

})
export class AddQuizComponent implements OnInit {

  @Input() courseId;
  @Input() videoId;
  @Input() videoList;
  @Input() selectCourseName;
  @Input() quizDetails;
  @Input() enableQuiz;
  @Output() valueChange = new EventEmitter();
  courseUpdate = false;
  videoDetails = [];
  // courseId;
  // videoId;
  questionForm;
  weightage;
  questionOptions = [];
  courseOptions = [];
  videoOptions = [];
  optionType = false;
  videoName;
  selectedVideo;
  selectedCourse;
  quizQuestionsForm = [];
  title;
  apiUrls;
  hidemodule = false;
  optionData = true;
  
  constructor(private courseService:CourseService,private headerService: HeaderService,private alertService:AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public constant: QuizVar,private toastr: ToastrService) {
    this.apiUrls = API_URL.URLS;
  }
  
  ngOnInit() {
    this.selectedVideo = this.videoId ? this.videoId : null;
    this.selectedCourse = this.courseId ? this.courseId : null;
    this.questionOptions = [
      { name: "MCQ", value: "MCQ" },
      { name: "True/False", value: "True/False" },
      { name: "Non-MCQ", value: "NON-MCQ" }
    ];
    this.quizQuestionsForm = [{
      // "questionId": 1,
      "questionName": "",
      "questionType": "MCQ",
      "options": [
        { "optionId": 1, "optionName": "" },
        { "optionId": 2, "optionName": "" },
        { "optionId": 3, "optionName": "" },
        { "optionId": 4, "optionName": "" }
      ],
      "weightage": '100'
    }];

    // this.courseOptions = [
    //   { name: "Uniform and Appearance Policy", value: "1" },
    //   { name: "Park Smart Safety", value: "2" },
    //   { name: "Basic Rails", value: "3" },
    //   { name: "Welcome to 2018/19", value: "4" }
    // ];
    // this.videoOptions = [
    //   { name: "Video name 1", value: "1" },
    //   { name: "Video name 2", value: "2" },
    //   { name: "Video name 3", value: "3" },
    //   { name: "Video name 4", value: "4" }
    // ];


    if(this.enableQuiz){
      this.editQuizDetails(this.quizDetails);
    }
    if (this.courseId) {
      //'5c0f73143100002c0924ec31'
      // this.editQuizDetails();
    }
    else {
      this.weightage = 100;
    }
  }

  optionValueUpdate(){
    this.optionData = !this.optionData;
  }
  
  editQuizDetails(quizData){
    // this.http.get(this.apiUrls.getQuiz).subscribe((resp) => {
      // this.videoDetails = resp.QuizDetails;
      // let slectedQuizDetails = resp.QuizDetails.find(x => x.CourseId === this.courseId);
      // let selectedVideoList = slectedQuizDetails && slectedQuizDetails.Videos && slectedQuizDetails.Videos[0];
      let selectedVideoList = quizData;
      this.selectedVideo = this.videoId;
      this.selectedCourse = this.courseId;
      this.quizQuestionsForm = selectedVideoList && selectedVideoList.length ? selectedVideoList : [{
        // "questionId": 1,
        "questionName": "",
        "questionType": "MCQ",
        "options": [
          { "optionId": 1, "optionName": "" },
          { "optionId": 2, "optionName": "" },
          { "optionId": 3, "optionName": "" },
          { "optionId": 4, "optionName": "" }
        ],
        "weightage": '100'
      }];
      this.weightage = selectedVideoList && selectedVideoList  ? (100 / selectedVideoList.length).toFixed(2) : 100;
    // });
  }
   // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    quiz[i].QuestionType = data;
    if (data === "1") {
      quiz[i].option = '';
      quiz[i].options = [
        { "optionId": 1, "OptionName": "" },
        { "optionId": 2, "OptionName": "" },
        { "optionId": 3, "OptionName": "" },
        { "optionId": 4, "OptionName": "" }
      ];
    }
    else if(data === "2"){
      quiz[i].options = [];
      quiz[i].option = "True/False"
    }
    else{
      quiz[i].options = [];
      quiz[i].option = '';
      quiz[i].answer = '';
    }
  }


  courseChange(){
    // // this.selectedCourse = 1;
    // console.log(this.selectedCourse);
  }

  // Add Question Box
  addQuestionForm() {
    let obj = {
      // "questionId": 1,
      "questionName": "",
      "questionType": "MCQ",
      "options": [
        { "optionId": 1, "optionName": "" },
        { "optionId": 2, "optionName": "" },
        { "optionId": 3, "optionName": "" },
        { "optionId": 4, "optionName": "" }
      ],
      "weightage": '100'
    };
    // obj.questionId = this.quizQuestionsForm.length + 1;
    this.quizQuestionsForm.push(obj);
    obj.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
  }

  // Remove Question Box
  removeQuestionForm(index) {
    if(this.quizQuestionsForm.length>1){
      this.quizQuestionsForm.splice(index, 1);
      this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
    }
    else{
      this.alertService.warn("Minimum one quiz is mandatory");
    }
  }

  valueChanged(update){
    this.courseUpdate = true;
    let data = {
      courseUpdate : true,
      type : update ? true : false
    }
    this.valueChange.emit(data);
  }

  // Quiz Submission
  quizSubmit() {
    //Weightage update
    if(this.selectCourseName){
      let data = this.quizQuestionsForm.map(item => {
          item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
          return item;
      })
      //final data for submission
      let params = {
        "trainingClassName":this.selectCourseName,
        "files":[],
        "quizQuestions":data
        }
        if(this.videoList.length){
          params.files = this.videoList.map(item=>{
            let obj = {
              fileName : item.videoName,
              fileDescription : item.description,
              fileType : item.fileType,
              fileUrl : item.url
            }
            return obj;
          })
        }
      if(this.courseId){
        // params.courseId = this.courseId;
        console.log(params);
        // this.toastr.success("Quiz updated successfully");
        this.valueChanged(true);
      }
      else{
        console.log(JSON.stringify(params));
        this.courseService.addTrainingClass(params).subscribe((result)=>{
          console.log(result)
        })
      
        this.valueChanged(false);
        this.redirectCourseList();
      }
    }
    else{
      //this.toastr.error("Course name is mandatory");
      this.alertService.error("Training Class is mandatory");
      this.courseId ? 
        this.valueChanged(true)
        :
        this.valueChanged(false);
        this.redirectCourseList();
    }
  }

  redirectCourseList(){
    this.route.navigateByUrl('/cms-library');
  }
}
