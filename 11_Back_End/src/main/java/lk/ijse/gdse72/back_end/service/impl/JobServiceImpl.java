package lk.ijse.gdse72.back_end.service.impl;

import lk.ijse.gdse72.back_end.dto.JobDTO;
import lk.ijse.gdse72.back_end.entity.Job;
import lk.ijse.gdse72.back_end.repository.JobRepository;
import lk.ijse.gdse72.back_end.service.JobService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.boot.autoconfigure.websocket.servlet.TomcatWebSocketServletWebServerCustomizer;
import org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;
    private final WebSocketServletAutoConfiguration webSocketServletAutoConfiguration;
    private final TomcatWebSocketServletWebServerCustomizer websocketServletWebServerCustomizer;

    @Override
    public void saveJob(JobDTO jobDTO) {

        System.out.println("job saved ");
//        Job job = new Job();
//        job.setJobTitle(jobDTO.getJobTitle());
//        job.setCompany(jobDTO.getCompany());
//        job.setType(jobDTO.getType());
//        job.setLocation(jobDTO.getLocation());
//        job.setJobDescription(jobDTO.getJobDescription());
        jobRepository.save(modelMapper.map(jobDTO, Job.class));
//        System.out.println("Job Title: " + jobDTO.getJobTitle());
//        System.out.println("Company: " + jobDTO.getCompany());
//        System.out.println("Location: " + jobDTO.getLocation());
//        System.out.println("Type: " + jobDTO.getType());
//        System.out.println("Job Description: " + jobDTO.getJobDescription());
    }

    @Override
    public void updateJob(JobDTO jobDTO) {
        jobRepository.save(modelMapper.map(jobDTO, Job.class));
    }

    @Override
    public List<JobDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream().map(job -> modelMapper.map(job, JobDTO.class)).toList();
    }

    @Override
    public void changeJobStatus(int id) {
        jobRepository.changeJobStatus(id);
    }

    @Override
    public List<JobDTO> getAllJobsByKeyWord( String keyword) {
        List<Job> jobs = jobRepository.findJobByJobTitleContainingIgnoreCase(keyword);
        return jobs.stream().map(job -> modelMapper.map(job, JobDTO.class)).toList();
    }

//    @Override
//    public List<JobDTO> getAllJobsWithPaging(int page, int perPage, String keyword, String direction, String sort) {
//        Page<Job> jobPage;
//
//        if (direction.equalsIgnoreCase("asc")){
//            jobPage = jobRepository.findJobDataWithPaging(keyword, PageRequest.of(page, perPage, Sort.by(Sort.Direction.ASC, sort)));
//        }else{
//            jobPage = jobRepository.findJobDataWithPaging(keyword, PageRequest.of(page, perPage, Sort.by(Sort.Direction.DESC, sort)));
//        }
//        return jobPage.stream().map(job -> modelMapper.map(job, JobDTO.class)).toList();
//    }


    public Page<JobDTO> getAllJobsWithPaging(int page, int perPage, String keyword, String direction, String sort) {
        Page<Job> jobPage;

        if (direction.equalsIgnoreCase("asc")) {
            jobPage = jobRepository.findJobDataWithPaging(keyword, PageRequest.of(page, perPage, Sort.by(Sort.Direction.ASC, sort)));
        } else {
            jobPage = jobRepository.findJobDataWithPaging(keyword, PageRequest.of(page, perPage, Sort.by(Sort.Direction.DESC, sort)));
        }

        // Map Page<Job> -> Page<JobDTO>
        return jobPage.map(job -> modelMapper.map(job, JobDTO.class));
    }

}
