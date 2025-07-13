package lk.ijse.gdse72.back_end.controller;

import lk.ijse.gdse72.back_end.dto.JobDTO;
import lk.ijse.gdse72.back_end.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/job")
@RequiredArgsConstructor
@CrossOrigin
public class JobController {

//    @PostMapping("created")
//    public String createJob(){
//        return "Job Created";
//    }
//
//    @GetMapping("getall")
//    public String getAllJob(){
//        return "Job Controller";
//    }
//
//    @PutMapping("update")
//    public String updateJob(){
//        return "Job Updated";
//    }
//
//    @PutMapping("changestaus")
//    public String changeJobStatus(){
//        return "Job Deleted";
//    }
//
//    @GetMapping("search")
//    public String searchJob(){
//        return "Job Search";
//    }

    private final JobService jobService;

    @PostMapping("create")
    public String createJob(@RequestBody JobDTO jobDTO) {
//        System.out.println(jobDTO.getJobTitle() + " \n" + jobDTO.getCompany() + " \n" + jobDTO.getLocation() + " \n" + jobDTO.getType() + " \n" + jobDTO.getJobDescription());
        jobService.saveJob(jobDTO);
        return "Job Created";
    }

    @PutMapping("update")
    public String updateJob(@RequestBody JobDTO jobDTO) {
        jobService.updateJob(jobDTO);
        return "Job Updated";
    }

    @GetMapping("getall")
    public List<JobDTO> getAllJob() {
        List<JobDTO> jobDTOS = jobService.getAllJobs();
        return jobDTOS;
    }

    @PatchMapping("status/{id}")
    public String changeJobStatus(@PathVariable int id) {
        jobService.changeJobStatus(id);
        return "Job Status Updated for ID: " + id;
    }

    @GetMapping("search/{id}")
    public List<JobDTO> searchJob(@PathVariable String id) {
        List<JobDTO> jobDTOS = jobService.getAllJobsByKeyWord(id);
        return jobDTOS;
    }

    @GetMapping("paging")
    public Page<JobDTO> getAllJobsWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int per_page,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "id") String sort
    ) {
        return jobService.getAllJobsWithPaging(page, per_page, keyword, direction, sort);
    }
}
