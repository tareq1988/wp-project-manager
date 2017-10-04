import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({
    /**
     * Assign global property
     * 
     * @type Object
     */
    state: {
        lists: [],
        list: {},
        list_comments: [],
        lists_meta: {},
        milestones: [],
        init: {},
        is_single_list: true,
        project_users: [],
        loading: true,
        is_active_list_form: false,
        project_id: false,
        permissions: {
            create_todolist: true
        },
        task: {},
        is_single_task: false,
        add_filter: {},
        todo_list_per_page: 5,
        get_current_user_id: 1,
        active_mode: 'list',
        inline_task_users: [],
        inline_task_start_date: '',
        inline_task_end_date: '',
        inline_task_description: '',
        inline_todo_list_id: 0,
        inline_display: {
            users: false,
            start: false,
            end: false,
            lists: false,
            description: false
        },
        total_list_page: 0,
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
    },

    /**
     * Change any global property from here
     */
    mutations: {

        /**
         * Store todo lists page initial property
         * 
         * @param object state     
         * @param object task_init 
         *
         * @return void
         */
        setTaskInitData: function( state, task_init ) {
            state.lists         = [];
            state.list_total    = 0;
            state.milestones    = [];
            state.init          = {};
            state.project_users = [];
            state.permissions   = {};

            state.loading        = true;
            state.is_single_list = false,
            
            Vue.nextTick(function () {
                state.lists         = task_init.data.lists;
                state.milestones    = task_init.data.milestones;
                state.init          = task_init.data;
                state.project_users = task_init.data.project_users;
                state.permissions   = task_init.data.permissions;
               // state.list_total    = task_init.data.list_total;
               // state.todo_list_per_page = task_init.data.todo_list_per_page;
                //state.active_mode = task_init.data.active_mode;
                state.loading        = false;
                state.is_single_list = false;
            });
        },

        loadingEffect: function(state, loading_status) {
            state.loading = loading_status;
        },

        /**
         * New todo list form showing or hiding
         * 
         * @param  object state 
         * 
         * @return void       
         */
        newTodoListForm: function( state ) {
            state.show_list_form = state.show_list_form ? false : true;;
        },

        /**
         * Update todo list form showing or hiding
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return void       
         */
        showHideUpdatelistForm: function( state, list ) {
            state.lists[list.list_index].edit_mode = state.lists[list.list_index].edit_mode ? false : true; 
        },

        /**
         * Showing and hiding task insert and edit form
         * 
         * @param  object state 
         * @param  int index 
         * 
         * @return void       
         */
        showHideTaskForm: function( state, index ) {
            
            if ( ( typeof index.task_index == 'undefined' ) || ( index.task_index === false ) ) {
                state.lists[index.list_index].show_task_form = state.lists[index.list_index].show_task_form ? false : true; 
            } else {
                state.lists[index.list_index].tasks[index.task_index].edit_mode = state.lists[index.list_index].tasks[index.task_index].edit_mode ? false : true; 
            }
        },

        /**
         * Update state lists property after insert new todo list or update todo list
         * 
         * @param  object state 
         * @param  object res   
         * 
         * @return void       
         */
        update_todo_list: function( state, res ) {

            if ( res.is_update ) {
                state.lists.splice( res.index, 1 );
                state.lists.splice( res.index, 0, res.res_list );
            } else {
                state.lists.splice( 0, 0, res.res_list );
            }
        },

        /**
         * Insert new task to state lists.tasks property. 
         *  
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        afterUpdateTask: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );

            if ( data.task.status === 'incomplete' ) {
                var task_index = state.getIndex( 
                        state.lists[list_index].incomplete_tasks.data, 
                        data.task.id, 
                        'id' 
                );
                
                state.lists[list_index].incomplete_tasks.data.splice( task_index, 1, data.task );
            }
        },

        afterNewTask (state, data) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );
            if ( data.task.status === 'incomplete' ) {
                state.lists[list_index].incomplete_tasks.data.splice( 0, 0, data.task );
            }

            state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
        },

        /**
         * When goto single todo list page. Empty the state lists array and insert single todo list. 
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        update_todo_list_single: function( state, data ) {
            
            state.lists          = [];
            state.milestones     = [];
            state.project_users  = [];

            Vue.nextTick(function () {
                state.lists.push(data.list);
                state.milestones     = data.milestones;
                state.project_users  = data.project_users;
                state.permissions    = data.permissions;
                state.is_single_list = true;
            });
        },

        /**
         * Make single task complete and incomplete
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        afterTaskDoneUndone: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );
            
            if (data.status === true) {
                var task_index = state.getIndex( state.lists[list_index].incomplete_tasks.data, data.task_id, 'id' );
                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);
                
                if (typeof state.lists[list_index].complete_tasks !== 'undefined') {

                    state.lists[list_index].complete_tasks.data.splice(0,0,data.task);
                } 

                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks + 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            }

            if (data.status === false) {
                var task_index = state.getIndex( state.lists[list_index].complete_tasks.data, data.task_id, 'id' );
                state.lists[list_index].complete_tasks.data.splice(task_index, 1);
                
                if (typeof state.lists[list_index].incomplete_tasks !== 'undefined') {

                    state.lists[list_index].incomplete_tasks.data.splice(0,0,data.task);
                } 

                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
            }
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listNewComment: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );

            state.lists[list_index].comments.data.splice(0,0,data.comment);
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listUpdateComment: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' ),
                comment_index = state.getIndex( state.lists[list_index].comments.data, data.comment_id, 'id' );

            state.lists[list_index].comments.data.splice(comment_index,1,data.comment);
        },

        /**
         * Remove comment from list
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_comment: function( state, data ) {
            state.lists[data.list_index].comments.splice( data.comment_index, 1 );
        },

        /**
         * Remove comment from task
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_task_comment: function( state, data ) {
            state.lists[data.list_index].tasks[data.task_index].comments.splice( data.comment_index, 1 );
        },

        /**
         * Showing todo-list comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideListCommentEditForm: function( state, data ) {

            if ( data.comment_index !== false ) {
                state.lists[data.list_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Showing task comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideTaskCommentEditForm: function( state, data ) {
            if ( data.comment_index !== false ) {
                state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Set single task popup data to vuex store
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        single_task_popup: function( state ) {
            console.log('aldkjadsk');
            state.task = task.task;
        },

        /**
         * Make empty store task and make false is_single_task
         * 
         * @param  object state 
         * 
         * @return void       
         */
        close_single_task_popup: function( state ) {
            state.is_single_task = false;
            //state.task = {};
        },

        update_task_comment: function( state, comment ) {
            state.lists[comment.list_index].tasks[comment.task_index].comments.push(comment.comment);
        },

        /**
         * Remove todo list 
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return return
         */
        after_delete_todo_list: function( state, list ) {
            state.lists.splice( list.list_index, 1 );
        },

        /**
         * After delete task
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        afterDeleteTask: function( state, data ) {
            var list_index = state.getIndex(state.lists, data.list.id, 'id');

            if ( data.task.status === false || data.task.status === 'incomplete' ) {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            } else {
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task.id, 'id');
                state.lists[list_index].complete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
            }
            
        },

        /**
         * After get tasks from list id
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        insert_tasks: function( state, task ) {
            
            task.tasks.tasks.forEach(function(task_obj) {
                //console.log(task);
               state.lists[task.list_index].tasks.push(task_obj);
            });
            //state.lists[task.list_index].tasks = task.tasks.tasks;
        },

        emptyTodoLists: function(state) {
            state.lists = [];
        },

        /**
         * Chanage view active mode
         *
         * @param  object state 
         * @param  object mode 
         * 
         * @return void
         */
        change_active_mode: function(state, mode) {
            state.active_mode = mode.mode;
        },

        add_inline_task_users: function(state, users) {
            state.inline_task_users = users.users;
        },

        add_inline_task_start_date: function(state, date) {
            state.inline_task_start_date = date.date;
        },

        add_inline_task_end_date: function(state, date) {
            state.inline_task_end_date = date.date;
        },

        add_inline_task_description: function(state, description) {
            state.inline_task_description = description.description;
        },

        add_inline_todo_list_id: function(state, list) {
            state.inline_todo_list_id = list.list_id;
        },

        inline_display: function(state, inline_display) {
            state.inline_display = inline_display;
        },

        loading_effect: function(state, effect) {
            state.loading = effect.mode;
        },

        afterUpdateTaskElement: function(state, task) {
            jQuery.extend(true, state.lists[task.list_index].tasks[task.task_index], task.task);
            state.lists[task.list_index].tasks[task.task_index].assigned_to = task.task.assigned_to;
        },

        setLists (state, lists) {

            if(state.lists.length > 0){
                lists.forEach(function(list){
                    
                    var list_index = state.getIndex(state.lists, list.id, 'id');
                    if(list_index === false){
                         state.lists.push(list);
                    }
                    
                })
            }else{
                state.lists =lists;
            }
           

            
        },
        setList(state, list){
            state.list =list;
        },
        afterNewList (state, list) {
            var per_page = state.lists_meta.per_page,
                length   = state.lists.length;

            if (per_page <= length) {
                state.lists.splice(0,0,list);
                state.lists.pop();
            } else {
                state.lists.splice(0,0,list);
            }
        },
        afterUpdateList (state, list) {
            var list_index = state.getIndex(state.lists, list.id, 'id');
            var merge_list = jQuery.extend(true, state.lists[list_index], list);
            state.lists.splice(list_index,1,merge_list);
        },
        afterNewListupdateListsMeta (state) {
            state.lists_meta.total = state.lists_meta.total + 1;
            state.lists_meta.total_pages = Math.ceil( state.lists_meta.total / state.lists_meta.per_page );
        },
        afterDeleteList (state, list_id) {
            var list_index = state.getIndex(state.lists, list_id, 'id');
            state.lists.splice(list_index,1);
        },

        setListComments (state, comments) {
            state.list_comments = comments;
        },

        setListForSingleListPage (state, list) {
            state.list = list;
        },

        setMilestones (state, milestones) {
            state.milestones = milestones;
        },

        showHideListFormStatus (state, status) {
            if ( status === 'toggle' ) {
                state.is_active_list_form = state.is_active_list_form ? false : true;
            } else {
                state.is_active_list_form = status;
            }
        },

        setTotalListPage (state, total) {
            state.total_list_page = total;
        },

        setListsMeta (state, meta) {
            state.lists_meta = meta;
        },
        setSingleTask (state, data) {
            state.task = data;
 
        },
        setTasks(state, data){
            var list_index = state.getIndex(state.lists, data.id, 'id');
            data.incomplete_tasks.data.forEach(function(task){
                state.lists[list_index].incomplete_tasks.data.push(task)
            });
            state.lists[list_index].incomplete_tasks.meta = data.incomplete_tasks.meta;
        }
    }
});