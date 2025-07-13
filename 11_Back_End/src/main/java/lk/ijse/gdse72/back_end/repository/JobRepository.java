package lk.ijse.gdse72.back_end.repository;

import jakarta.transaction.Transactional;
import lk.ijse.gdse72.back_end.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job,Integer> {

    @Transactional
    @Modifying
    @Query(value="UPDATE Job SET status = 'Dactivated' WHERE id = ?1", nativeQuery = true)
    void changeJobStatus(int id);

    List<Job> findJobByJobTitleContainingIgnoreCase(String keyword);

    @Query(value = "SELECT j FROM Job j WHERE j.jobTitle LIKE %:keyword%")
    Page<Job> findJobDataWithPaging(String keyword, PageRequest of);
}
