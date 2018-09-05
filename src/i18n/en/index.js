export default {
  buttons: {
    update_access_control: 'Change access settings',
    arrow_next: '>',
    arrow_prev: '<',
    abort: 'Abort',
    apply_synchronisation: 'Apply Synchronisation',
    annotate: 'Annotate',
    add_video: 'Add Video',
    add_and_go: 'Add & Go',
    back: 'Back',
    create_account: 'Create Account',
    create_timeline: 'Create Timeline',
    create_grid: 'Create Grid',
    cancel: 'Cancel',
    change: 'Change',
    delete: 'Delete',
    download_archive: 'Download Archive',
    done: 'Done',
    edit: 'Edit',
    export_timeline: 'Export Timeline',
    forgot_password: 'Forgot Password',
    live_annotate: 'Live Annotate',
    live_annotate_timeline: 'Live Annotate this timeline',
    login: 'Sign In',
    more_info: 'More info',
    no: 'No',
    request_reset_pass: 'Request Password Reset',
    save_changes: 'Save changes',
    save: 'Save',
    set_marker: 'Set Marker',
    submit: 'Submit',
    synchronize: 'Sync',
    videos: 'Videos',
    yes: 'Yes'
  },
  checkboxes: {
    delete: 'delete',
    read: 'read',
    write: 'write'
  },
  forms: {
    timelines: {
      import: {
        title: 'Upload timeline archive',
        fields: {
          title: 'New title (optional, creates a copy)'
        }
      }
    }
  },
  errors: {
    unknown: 'Unknown Error',
    invalid_email: 'Please enter a valid email',
    invalid_password: 'Password must be min. 6 characters long',
    invalid_password_confirmation: 'Passwords do not match',
    invalid_url: 'Invalid URL format',
    field_required: 'This field is mandatory',
    has_duplicates: 'Import has existing items, please import as a copy',
    grid_delete_failed: 'Failed to delete Grid',
    timeline_delete_failed: 'Failed to delete Timeline'
  },
  labels: {
    access_control: 'Access Control',
    access_control_public: 'Public',
    add_group: 'Add Group',
    annotations: 'Annotations',
    annotation_body: 'Annotation text',
    accept_terms: 'I accept the Terms and Conditions',
    author: 'Author',
    created: 'Created',
    updated: 'Updated',
    description: 'Description',
    duration: 'Duration',
    edit_title: 'Edit title',
    email: 'Email',
    embedded: 'Embedded in',
    empty: 'empty',
    elements_length: 'Used Elements',
    // timeline_title: 'Timeline title',
    timeline_title: 'Timeline title',
    grid_title: 'Grid title',
    last_annotation: 'Last annotated',
    last_edit: 'Last edit',
    location: 'Location',
    map_title: 'Map Title',
    name: 'Name',
    new_tag: 'New tag',
    new_group_title: 'New group title',
    organisation: 'Organisation',
    participants: 'Participants',
    password: 'Password',
    password_confirmation: 'Password confirmation',
    status: 'Status',
    set_title: 'Set Title',
    starting_point: 'Starting point',
    tag: 'Tag',
    tags: 'Tags',
    title: 'Title',
    title_unknown: 'Unknown Title',
    video_title: 'Video title',
    video_url: 'Video URL'
  },
  links: {
    click_to_register: 'Click here to create an account.'
  },
  messages: {
    acl_updated: 'Access settings updated',
    login_success: 'Login successful',
    logout_notice: 'You have been logged out',
    registration_success: 'Account was successfully created. You can log in now!',
    registration_success_confirm: 'Account was successfully created. Check your inbox to confirm your email!',
    request_reset_success: 'Check your inbox for an email detailing how to reset your password.',
    update_success: 'Update successful',
    submit_success: 'Submission successful',
    timeline_imported: 'Timeline imported successfully',
    timeline_deleted: 'Timeline deleted',
    grid_imported: 'Grid imported successfully',
    grid_deleted: 'Grid deleted',
    confirm_delete: 'Delete this item?'
  },
  navigation: {
    annotate_video: 'Annotate Video',
    maps: 'Maps',
    contact: 'Contact',
    imprint: 'Imprint',
    repo: 'GitLab',
    logout: 'Sign Out',
    login: 'Sign In',
    manage_account: 'Account',
    terms: 'Terms'
  },
  routes: {
    annotate: {
      video: {
        title: 'Annotate Video',
        caption: 'Select a map and enter a video URL to start annotating.'
      }
    },
    errors: {
      not_found: {
        title: 'Nothing.',
        caption: 'Are you sure you have the right URL?'
      }
    },
    maps: {
      create: {
        title: 'Create Map',
        caption: 'A map represents a temporal or spatial continuum (e.g. a Timeline or a Mind Map)'
      },
      edit: {
        title: 'Edit Map',
        caption: 'A map represents a temporal or spatial continuum (e.g. a Timeline or a Mind Map)'
      },
      list: {
        title: 'My Maps',
        caption: 'A map represents a temporal or spatial continuum (e.g. a Timeline or a Mind Map)'
      }
    },
    media: {
      record: {
        title: 'Record',
        caption: 'Media recording via Cellphone, Web- or other USB-camera.'
      }
    },
    mocabulary: {
      trees: {
        title: 'Mocabulary list',
        caption: 'captions'
      }
    },
    users: {
      create: {
        title: 'Create Account',
        caption: 'Fill out the form to create a new account.'
      },
      forgot: {
        title: 'Forgot Password',
        caption: 'Enter the Email address associated with your account to request a password reset.'
      },
      first_login: {
        title: 'First Login',
        caption: 'Please leave some information about you.'
      },
      login: {
        title: 'Login',
        caption: 'Please authenticate with your Piecemaker credentials.'
      },
      manage: {
        title: 'Manage Account',
        caption: 'Update your details and login credentials.',
        first_login: 'As this is your first login, please update your profile info.'
      }
    },
    site: {
      account: {
        title: 'Account',
        caption: 'Lorem ipsum dolores account.'
      },
      help: {
        title: 'Help',
        caption: 'Lorem ipsum dolores help.'
      },
      terms: {
        title: 'Terms & Conditions',
        caption: 'Software and service are provided as is. We are not making any guarantees about availability or security of information you are giving or data you are adding to the system.'
      },
      contact: {
        title: 'Contact',
        caption: 'When getting in touch, please remember that we are located in Germany and are a research project, not a service or company.'
      }
    },
    piecemaker: {
      add: {
        title: 'Add',
        caption: 'Add an URL'
      },
      timelines: {
        create: {
          title: 'New Timeline',
          // caption: 'Create a timeline representing a global timeline.'
          caption: 'Create a global timeline.'
        },
        edit: {
          title: 'Edit Timeline',
          caption: 'Edit timeline details.'
        },
        list: {
          title: 'All timelines',
          caption: 'All timelines you have access to.'
        },
        session: {
          title: 'Session',
          caption: 'Lorem ipsum session.'
        },
        show: {
          title: 'Timeline',
          caption: 'Lorem ipsum show.'
        },
        users: {
          title: 'Users in this timeline',
          caption: '.'
        }
      },
      videos: {
        list: {
          title: 'Videos',
          caption: 'All your most wonderful videos are here.'
        },
        edit: {
          title: 'Edit Video',
          caption: 'Edit video details.'
        },
        create: {
          title: 'Add Video',
          caption: 'Add a new video to your timeline.'
        }
      }
    },
    mosys: {
      add: {
        title: 'Add',
        caption: 'Add an URL'
      },
      grids: {
        buttons: {
          edit: 'Edit',
          show: 'View',
          annotate: 'Add cells'
        },
        create: {
          button: 'Create Grid', // TODO: where do buttons belong?
          title: 'New Grid',
          caption: 'Create a grid'
        },
        list: {
          title: 'Grids',
          caption: 'All your grids'
        },
        edit: {
          title: 'Edit grid',
          caption: 'Edit grid details'
        },
        users: {
          title: 'Users in this grid',
          caption: '.'
        }
      }
    }
  },
  site: {
    copyright: 'Copyright 2018 Motion Bank',
    license: 'License',
    tagline: 'Digital Research and Annotation Platform for Contemporary Dance.',
    title: 'Web Systems',
    version: 'UI Version:'
  },
  table: {
    no_data: 'No data to display.',
    no_data_in_filter: 'Filter yielded no results.'
  }
}
