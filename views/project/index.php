<?php
$project_obj = CPM_Project::getInstance();
$projects = $project_obj->get_projects();
?>
<?php if(is_admin()): ?>
<div class="icon32" id="icon-themes"><br></div>
<h2><?php _e( 'Project Manager', 'cpm' ); ?></h2>
<?php endif; ?>

<?php cpm_project_filters(); ?>

<div class="cpm-projects">

    <?php //show only for editor or above ?>
    <?php if ( $project_obj->has_admin_rights() ) { ?>
        <nav class="cpm-new-project">
            <a href="#" id="cpm-create-project"><span><?php _e( 'New Project', 'cpm' ); ?></span></a>
        </nav>
    <?php } ?>

    <?php
    $i = 0;
    foreach ($projects as $project) {
        if ( !$project_obj->has_permission( $project ) ) {
            continue;
        }
        $i++;
        $completed = $project->info->completed;
        ?>

        <article class="cpm-project<?php echo $completed?' completed':''?>">
            <a href="<?php echo cpm_url_project_details( $project->ID ); ?>">
                <h5><?php echo get_the_title( $project->ID ); ?></h5>

                <div class="cpm-project-detail"><?php echo cpm_excerpt( $project->post_content, 55 ); ?></div>
                <div class="cpm-project-meta">
                    <?php echo cpm_project_summary( $project->info ); ?>
                </div>
                <footer class="cpm-project-people">
                    <?php
                    foreach ($project->users as $user) {
                        echo get_avatar( $user['id'], 48, '', $user['name'] );
                    }
                    ?>
                </footer>
            </a>
            <?php
            $progress = $project_obj->get_progress_by_tasks( $project->ID );
            echo cpm_task_completeness( $progress['total'], $progress['completed'] );
            if($completed) echo '<div class="cpm-completed-tag"></div>';
            ?>
        </article>

    <?php } ?>
    
    <?php if ( !$projects || $i==0) {
        cpm_show_message( __( 'No projects found!', 'cpm' ) );
    }?>

</div>

<div id="cpm-project-dialog" title="<?php _e( 'Start a new project', 'cpm' ); ?>">
    <?php if ( $project_obj->has_admin_rights() ) { ?>
        <?php cpm_project_form(); ?>
    <?php } ?>
</div>