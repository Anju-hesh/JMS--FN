// const BASE_URL = "http://localhost:8080/api/v1/job";
//
// function loadJobs() {
//     $.ajax({
//         url: `${BASE_URL}/getall`,
//         method: "GET",
//         success: function (jobs) {
//             let tbody = "";
//             $.each(jobs, function (index, job) {
//                 tbody += `
//                     <tr>
//                         <td>${index + 1}</td>
//                         <td>${job.jobTitle}</td>
//                         <td>${job.company}</td>
//                         <td>${job.location}</td>
//                         <td>${job.type}</td>
//                         <td>${job.status || 'Active'}</td>
//                         <td>
//                             <button class="btn btn-sm btn-outline-primary me-1" onclick='editJob(${JSON.stringify(job)})'>Edit</button>
//                             <button class="btn btn-sm btn-outline-warning" onclick='changeJobStatus(${job.id})'>Deactivate</button>
//                         </td>
//                     </tr>
//                 `;
//             });
//             $("#jobsTableBody").html(tbody);
//         },
//         error: function (err) {
//             console.error("Error loading jobs:", err);
//         }
//     });
// }
//
//
// $("#saveJobBtn").click(function () {
//     const job = {
//         jobTitle: $("#jobTitle").val(),
//         company: $("#companyName").val(),
//         location: $("#jobLocation").val(),
//         type: $("#jobType").val(),
//         jobDescription: $("#jobDescription").val()
//     };
//
//     $.ajax({
//         url: `${BASE_URL}/create`,
//         method: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(job),
//         success: function (response) {
//             console.log("Create Response:", response);
//             loadJobs();
//         },
//         error: function (err) {
//             console.error("Error creating job:", err);
//         }
//     });
// });
//
// function changeJobStatus(id) {
//     $.ajax({
//         url: `${BASE_URL}/status/${id}`,
//         method: "PATCH",
//         success: function (response) {
//             console.log("Status Change Response:", response);
//             loadJobs();
//         },
//         error: function (err) {
//             console.error("Error changing status:", err);
//         }
//     });
// }
//
// function editJob(job) {
//     $("#editJobId").val(job.id);
//     $("#editJobTitle").val(job.jobTitle);
//     $("#editCompanyName").val(job.company);
//     $("#editJobLocation").val(job.location);
//     $("#editJobType").val(job.type);
//     $("#editJobDescription").val(job.jobDescription);
//
//     $("#editJobModal").modal('show');
// }
//
// $("#updateJobBtn").click(function () {
//     const job = {
//         id: $("#editJobId").val(),
//         jobTitle: $("#editJobTitle").val(),
//         company: $("#editCompanyName").val(),
//         location: $("#editJobLocation").val(),
//         type: $("#editJobType").val(),
//         jobDescription: $("#editJobDescription").val()
//     };
//
//     $.ajax({
//         url: `${BASE_URL}/update`,
//         method: "PUT",
//         contentType: "application/json",
//         data: JSON.stringify(job),
//         success: function (response) {
//             console.log("Update Response:", response);
//             loadJobs();
//         },
//         error: function (err) {
//             console.error("Error updating job:", err);
//         }
//     });
// });
//
// $("#searchInput").on("input", function () {
//     const keyword = $(this).val();
//
//     if (keyword.length === 0) {
//         loadJobs();
//         return;
//     }
//
//     $.ajax({
//         url: `${BASE_URL}/search/${keyword}`,
//         method: "GET",
//         success: function (jobs) {
//             let tbody = "";
//             $.each(jobs, function (index, job) {
//                 tbody += `
//                     <tr>
//                         <td>${index + 1}</td>
//                         <td>${job.jobTitle}</td>
//                         <td>${job.company}</td>
//                         <td>${job.location}</td>
//                         <td>${job.type}</td>
//                         <td>${job.status || 'Active'}</td>
//                         <td>
//                             <button class="btn btn-sm btn-outline-primary me-1" onclick='editJob(${JSON.stringify(job)})'>Edit</button>
//                             <button class="btn btn-sm btn-outline-warning" onclick='changeJobStatus(${job.id})'>Deactivate</button>
//                         </td>
//                     </tr>
//                 `;
//             });
//             $("#jobsTableBody").html(tbody);
//         },
//         error: function (err) {
//             console.error("Error searching jobs:", err);
//         }
//     });
// });
//
// $(document).ready(function () {
//     loadJobs();
// });
//
//


const BASE_URL = "http://localhost:8080/api/v1/job";

// Pagination configuration
const config = {
    currentPage: 0,
    itemsPerPage: 5,
    sortField: 'id',
    sortDirection: 'asc',
    keyword: ''
};

// Initialize when document is ready
$(document).ready(function() {
    loadJobs();
    setupEventListeners();
});

// Load jobs with pagination
function loadJobs() {
    showLoading(true);

    const { currentPage, itemsPerPage, sortField, sortDirection, keyword } = config;

    let url = `${BASE_URL}/paging?page=${currentPage}&per_page=${itemsPerPage}`;
    url += `&direction=${sortDirection}&sort=${sortField}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

    $.ajax({
        url: url,
        method: "GET",
        success: function(response) {
            showLoading(false);

            console.log("API Response:", response);

            // Handle both Page<> response and simple array response
            const jobs = response.content || response;
            const totalPages = response.totalPages || 1;
            const totalElements = response.totalElements || (Array.isArray(jobs) ? jobs.length : 0);

            if (!Array.isArray(jobs)) {
                console.error("Expected array of jobs but got:", jobs);
                showError("Invalid data format received from server");
                return;
            }

            renderJobs(jobs);
            renderPagination(totalPages, totalElements);
        },
        error: function(err) {
            showLoading(false);
            console.error("Error loading jobs:", err);
            showError("Failed to load jobs. Please try again.");
        }
    });
}

// Render jobs to the table
function renderJobs(jobs) {
    let tbody = "";
    const startIndex = config.currentPage * config.itemsPerPage;

    if (!jobs || jobs.length === 0) {
        tbody = '<tr><td colspan="7" class="text-center text-muted">No jobs found</td></tr>';
    } else {
        jobs.forEach((job, index) => {
            if (!job) return; // Skip null entries

            const status = job.status || 'ACTIVE';
            tbody += `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td>${job.jobTitle || '-'}</td>
                    <td>${job.company || '-'}</td>
                    <td>${job.location || '-'}</td>
                    <td>${job.type || '-'}</td>
                    <td><span class="badge ${status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}">${status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" 
                                onclick='editJob(${JSON.stringify(job)})'>
                            Edit
                        </button>
                        <button class="btn btn-sm ${status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'}" 
                                onclick='changeJobStatus(${job.id || 0}, "${status}")'>
                            ${status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    $("#jobsTableBody").html(tbody);
}

// Render pagination controls
function renderPagination(totalPages, totalElements) {
    const pagination = $("#pagination");
    pagination.empty();

    if (totalPages <= 1) return; // No pagination needed for single page

    // Previous button
    pagination.append(`
        <li class="page-item ${config.currentPage === 0 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${config.currentPage - 1}); return false;">&laquo;</a>
        </li>
    `);

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(0, config.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
        pagination.append(`
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(0); return false;">1</a>
            </li>
            ${startPage > 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `);
    }

    for (let i = startPage; i <= endPage; i++) {
        pagination.append(`
            <li class="page-item ${i === config.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i + 1}</a>
            </li>
        `);
    }

    if (endPage < totalPages - 1) {
        pagination.append(`
            ${endPage < totalPages - 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages - 1}); return false;">${totalPages}</a>
            </li>
        `);
    }

    // Next button
    pagination.append(`
        <li class="page-item ${config.currentPage >= totalPages - 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${config.currentPage + 1}); return false;">&raquo;</a>
        </li>
    `);

    // Update page info
    const startItem = (config.currentPage * config.itemsPerPage) + 1;
    const endItem = Math.min((config.currentPage + 1) * config.itemsPerPage, totalElements);
    $(".pagination-info").remove();
    pagination.after(`
        <div class="pagination-info text-center mt-2">
            Showing ${startItem} to ${endItem} of ${totalElements} entries
        </div>
    `);
}

// Change page
function changePage(page) {
    config.currentPage = page;
    loadJobs();
}

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    let searchTimer;
    $("#searchInput").on("input", function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            config.keyword = $(this).val();
            config.currentPage = 0;
            loadJobs();
        }, 300);
    });

    // Add job form
    $("#addJobForm").submit(function(e) {
        e.preventDefault();
        addJob();
    });

    // Edit job form
    $("#editJobForm").submit(function(e) {
        e.preventDefault();
        updateJob();
    });
}

// Add new job
function addJob() {
    const job = {
        jobTitle: $("#jobTitle").val(),
        company: $("#companyName").val(),
        location: $("#jobLocation").val(),
        type: $("#jobType").val(),
        jobDescription: $("#jobDescription").val()
    };

    $.ajax({
        url: `${BASE_URL}/create`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(job),
        success: function(response) {
            $("#addJobModal").modal('hide');
            $("#addJobForm")[0].reset();
            config.currentPage = 0;
            loadJobs();
            showToast("Job created successfully");
        },
        error: function(err) {
            console.error("Error creating job:", err);
            showError("Failed to create job. Please try again.");
        }
    });
}

// Edit job - populate modal
function editJob(job) {
    if (!job) return;

    $("#editJobId").val(job.id || '');
    $("#editJobTitle").val(job.jobTitle || '');
    $("#editCompanyName").val(job.company || '');
    $("#editJobLocation").val(job.location || '');
    $("#editJobType").val(job.type || 'Full-time');
    $("#editJobDescription").val(job.jobDescription || '');

    $("#editJobModal").modal('show');
}

// Update job
function updateJob() {
    const job = {
        id: $("#editJobId").val(),
        jobTitle: $("#editJobTitle").val(),
        company: $("#editCompanyName").val(),
        location: $("#editJobLocation").val(),
        type: $("#editJobType").val(),
        jobDescription: $("#editJobDescription").val()
    };

    $.ajax({
        url: `${BASE_URL}/update`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(job),
        success: function(response) {
            $("#editJobModal").modal('hide');
            loadJobs();
            showToast("Job updated successfully");
        },
        error: function(err) {
            console.error("Error updating job:", err);
            showError("Failed to update job. Please try again.");
        }
    });
}

// Change job status
function changeJobStatus(id, currentStatus) {
    if (!id) return;

    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${action} this job?`)) {
        return;
    }

    $.ajax({
        url: `${BASE_URL}/status/${id}`,
        method: "PATCH",
        success: function(response) {
            loadJobs();
            showToast(`Job ${action}d successfully`);
        },
        error: function(err) {
            console.error("Error changing job status:", err);
            showError(`Failed to ${action} job. Please try again.`);
        }
    });
}

// Utility functions
function showLoading(show) {
    if (show) {
        $("#jobsTableBody").html('<tr><td colspan="7" class="text-center"><div class="spinner-border text-primary" role="status"></div></td></tr>');
    }
}

function showError(message) {
    $("#jobsTableBody").html(`<tr><td colspan="7" class="text-center text-danger">${message}</td></tr>`);
    $("#pagination").empty();
}

function showToast(message) {
    // Simple toast notification - you can replace with a proper toast library
    const toast = $(`
        <div class="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);

    $("body").append(toast);
    const bsToast = new bootstrap.Toast(toast[0]);
    bsToast.show();

    setTimeout(() => {
        toast.remove();
    }, 3000);
}