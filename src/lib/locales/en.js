const en = {
  buttons: {
    arrow_next: '>',
    arrow_prev: '<',
    abort: 'Abort',
    apply_synchronisation: 'Apply Synchronisation',
    annotate: 'Annotate',
    add_video: 'Add Video',
    add_and_go: 'Add & Go',
    back: 'Back',
    create_account: 'Create Account',
    create_group: 'Create Group',
    cancel: 'Cancel',
    change: 'Change',
    delete: 'Delete',
    done: 'Done',
    edit: 'Edit',
    forgot_password: 'Forgot Password',
    login: 'Login',
    more_info: 'More info',
    request_reset_pass: 'Request Password Reset',
    save_changes: 'Save changes',
    save: 'Save',
    set_marker: 'Set Marker',
    submit: 'Submit',
    synchronize: 'Sync',
    videos: 'Videos'
  },
  errors: {
    unknown: 'Unknown Error',
    invalid_email: 'Please enter a valid email',
    invalid_password: 'Password must be min. 6 characters long',
    invalid_password_confirmation: 'Passwords do not match',
    invalid_url: 'Invalid URL format',
    field_required: 'This field is mandatory'
  },
  labels: {
    annotations: 'Annotations',
    annotation_body: 'Annotation text',
    accept_terms: 'I accept the Terms and Conditions',
    associated_map: 'Associate Video with Map',
    created: 'Created',
    description: 'Description',
    duration: 'Duration',
    edit_title: 'Edit title',
    email: 'Email',
    embedded: 'Embedded in',
    elements_length: 'Used Elements',
    group_title: 'Group title',
    last_annotation: 'Last annotated',
    last_edit: 'Last edit',
    location: 'Location',
    map_title: 'Map Title',
    name: 'Name',
    new_tag: 'New tag',
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
    video_title: 'Video title',
    video_url: 'Video URL'
  },
  links: {
    click_to_register: 'Click here to create an account.'
  },
  messages: {
    login_success: 'Login successful',
    logout_notice: 'You have been logged out',
    registration_success: 'Account was successfully created. You can log in now!',
    registration_success_confirm: 'Account was successfully created. Check your inbox to confirm your email!',
    request_reset_success: 'Check your inbox for an email detailing how to reset your password.',
    update_success: 'Update successful',
    submit_success: 'Submission successful'
  },
  navigation: {
    annotate_video: 'Annotate Video',
    maps: 'Maps',
    contact: 'Contact',
    imprint: 'Imprint',
    github: 'GitHub',
    logout: 'Logout',
    login: 'Login',
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
    users: {
      create: {
        title: 'Create Account',
        caption: 'Fill out the form to create a new account.'
      },
      forgot: {
        title: 'Forgot Password',
        caption: 'Enter the Email address associated with your account to request a password reset.'
      },
      login: {
        title: 'Login',
        caption: 'Please authenticate with your Piecemaker credentials.'
      },
      manage: {
        title: 'Manage Account',
        caption: 'Update your details and login credentials.'
      }
    },
    site: {
      terms: {
        title: 'Terms & Conditions',
        caption: 'Lorem ipsum dolores dings.'
      }
    },
    piecemaker: {
      add: {
        title: 'Add',
        caption: 'Add an URL'
      },
      groups: {
        create: {
          title: 'New Group',
          caption: 'Create a group representing a global timeline.'
        },
        list: {
          title: 'Groups',
          caption: 'All your most wonderful groups are here.'
        }
      },
      videos: {
        list: {
          title: 'Videos',
          caption: 'All your most wonderful videos are here.'
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
          title: 'Edit grid title'
        }
      }
    }
  },
  site: {
    copyright: 'Copyright 2018 Motion Bank',
    license: 'License',
    tagline: 'Digital Research and Annotation Platform for Contemporary Dance.',
    title: 'MoTools',
    version: 'UI Version:'
  },
  table: {
    no_data: 'No data to display.',
    no_data_in_filter: 'Filter yielded no results.'
  }
}

export default en
