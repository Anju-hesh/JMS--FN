package lk.ijse.gdse72.back_end.service;

import lk.ijse.gdse72.back_end.dto.JobDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobService {
    void saveJob(JobDTO jobDTO);
    void updateJob(JobDTO jobDTO);
    List<JobDTO> getAllJobs();
    void changeJobStatus(int id);
    List<JobDTO> getAllJobsByKeyWord(String keyword);

    Page<JobDTO> getAllJobsWithPaging(int page, int perPage, String keyword, String direction, String sort);
}
