export default {
  buttons: {
    update_access_control: 'Update access settings',
    annotations_index: 'Index',
    arrow_next: '>',
    arrow_prev: '<',
    abort: 'Abort',
    apply_synchronisation: 'Apply Synchronisation',
    annotate: 'Annotate',
    add_term: 'Add Term',
    add_media: 'Add Media',
    add_vocabulary: 'Add Vocabulary',
    add_and_go: 'Add & Go',
    back: 'Back',
    create_account: 'Create Account',
    close_account: 'Close Account',
    create_document: 'Add Document',
    create_timeline: 'Create Timeline',
    create_grid: 'Create Grid',
    create_package: 'Create Package',
    cancel: 'Cancel',
    change: 'Change',
    confirm: 'OK',
    copy_url: 'Copy URL',
    delete: 'Delete',
    download_archive: 'Download Archive',
    download_csv: 'Download CSV',
    download_package: 'Download Package',
    download: 'Download',
    done: 'Done',
    edit: 'Edit',
    export_grid: 'Export Grid',
    export_timeline: 'Export Timeline',
    export_timeline_csv: 'Export Timeline as CSV',
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
    set_css_class: 'Set CSS class',
    search: 'Search',
    submit: 'Submit',
    synchronize: 'Sync',
    media: 'Media',
    yes: 'Yes',
    do_not_show_again: 'Do not show again'
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
          title: 'New title (optional, creates a copy)',
          override_author: 'Set ownership to yourself for all imported items',
          skip_acl: 'Do not import access control settings'
        }
      }
    },
    grids: {
      import: {
        title: 'Upload grid archive',
        fields: {
          title: 'New title (optional, creates a copy)',
          override_author: 'Set ownership to yourself for all imported items',
          skip_acl: 'Do not import access control settings'
        }
      }
    },
    edit_css_class: {
      title: 'Edit CSS class name'
    }
  },
  errors: {
    document_delete_failed: 'Failed to delete Document',
    item_exists: 'This item already exists.',
    unknown: 'Unknown Error',
    invalid_email: 'Please enter a valid email',
    invalid_password: 'Password must be min. 6 characters long',
    invalid_password_confirmation: 'Passwords do not match',
    invalid_url: 'Invalid URL format',
    field_required: 'This field is mandatory',
    has_duplicates: 'Import has existing items, please import as a copy',
    grid_delete_failed: 'Failed to delete Grid',
    timeline_delete_failed: 'Failed to delete Timeline',
    create_annotation_failed: 'Failed to create annotation: {error}',
    update_annotation_failed: 'Failed to update annotation: {error}',
    delete_annotation_failed: 'Failed to remove annotation: {error}',
    list_annotations_failed: 'Failed to create annotation: {error}',
    export_archive_failed: 'Failed to export timeline archive: {error}',
    packaging_failed: 'Packaging failed: {error}',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    http_server_error: 'HTTP error {code}: {message}',
    generic_error: '{code} {message}'
  },
  labels: {
    id: 'ID',
    access_control: 'Access Control',
    access_control_public: 'Public',
    access_control_add_group: 'Add to group',
    access_control_remove_group: 'Remove from group',
    associated_timeline: 'Associated timeline',
    associated_timeline_warning: 'WARNING: If you already annotated this, your annotations are linked to the original timeline. Changing the associated timeline will only reassign this reference time, not the existing annotations.',
    recursive: 'Apply to all contained annotations and media',
    add_group: 'Add Group',
    add_term: 'Add Term',
    annotations: 'Index',
    annotation_body: 'Annotation text',
    accept_terms: 'I accept the Terms and Conditions',
    accept: 'Accept',
    author: 'Author',
    creator: 'Creator',
    biovision_hierarchy: 'Biovision Hierarchy',
    anonymous_creator: 'Anonymous',
    unknown_creator: 'Unknown',
    created: 'Created',
    css_stylesheet: 'CSS Stylesheet',
    updated: 'Updated',
    last_updated: 'Last updated',
    date: 'Date',
    delete_cell: 'Delete cell?',
    description: 'Description',
    duration: 'Duration',
    edit_title: 'Edit title',
    edit_term: 'Edit term',
    email: 'Email',
    embedded: 'Embedded in',
    empty: 'empty',
    elements_length: 'Used Elements',
    filmbox: 'Filmbox',
    // timeline_title: 'Timeline title',
    timeline_title: 'Timeline title',
    grid_title: 'Grid title',
    invitation: 'Invitation',
    last_annotation: 'Last annotated',
    last_edit: 'Last edit',
    location: 'Location',
    map_title: 'Map Title',
    my_vocabularies: 'my vocabularies',
    name: 'Name',
    new_tag: 'New tag',
    new_term: 'New term',
    new_group_title: 'New group title',
    group_title: 'Group title',
    new_vocabulary: 'New vocabulary',
    no_selection: 'No selection made.',
    organisation: 'Organisation',
    participants: 'Participants',
    password: 'Password',
    password_confirmation: 'Password confirmation',
    permissions: 'Permissions',
    public: 'Public',
    reject: 'Reject',
    status: 'Status',
    set_title: 'Set Title',
    set_shortcut: 'Set Shortcut',
    starting_point: 'Starting point',
    size: 'Size',
    tag: 'Tag',
    tags: 'Tags',
    textual_body: 'Annotations',
    title: 'Title',
    title_unknown: 'Unknown Title',
    timeline: 'Timeline',
    type: 'Type',
    media_duration: 'Media duration',
    media_title: 'Media title',
    media_url: 'Media URL',
    media: 'Media',
    vocabulary_entry: 'Vocabularies'
  },
  links: {
    click_to_register: 'Click here to create an account.'
  },
  descriptions: {
    access_control: 'Allow or disallow members of a group see your timeline and, optionally, the attached annotations.',
    access_control_documents: 'Allow or disallow members of a group and/or the public to see your Document',
    css_stylesheet: 'Either link an external stylesheet or set an inline value'
  },
  messages: {
    acl_updated: 'Access settings updated',
    document_created: 'Document created',
    document_deleted: 'Document deleted',
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
    confirm_delete: 'Delete this item?',
    confirm_remove_member: 'Remove this member?',
    confirm_delete_group: 'Delete this group?',
    updated_annotation: 'Updated annotation',
    url_copied: 'URL copied to clipboard',
    caution_media_time_override: 'Caution: Changing media reference time does not update associated annotations!',
    browser_unsupported_warning: '<strong>Unsupported browser:</strong> For optimal performance please use ' +
      '<a href="https://www.mozilla.org/firefox/" target="_blank">Firefox</a> or ' +
      '<a href="http://www.chromium.org/Home" target="_blank">Chromium</a>.<br>' +
      '<small>While the site might work on your browser, more or less subtle problems can occur. You have been warned!</small>',
    legacy_site_migration: 'Looking for the previous version and your data? It’s still there:'
  },
  navigation: {
    annotate_media: 'Annotate Media',
    maps: 'Maps',
    contact: 'Contact',
    imprint: 'Imprint',
    repo: 'GitLab',
    logout: 'Sign Out',
    login: 'Sign In',
    manage_account: 'Account',
    terms: 'Terms',
    piecemaker: {
      label: 'Piecemaker',
      piecemaker_timelines_list: 'Timelines',
      piecemaker_timelines_annotate: 'Live annotate',
      piecemaker_media_list: 'Media',
      piecemaker_media_annotate: 'Annotate',
      piecemaker_media_edit: 'Edit',
      piecemaker_media_sync: 'Sync',
      piecemaker_timelines_search: 'Search',
      piecemaker_timelines_edit: 'Edit',
      piecemaker_timelines_create: 'Create timeline'
    },
    mosys: {
      label: 'Mosys',
      mosys_grids_list: 'All Grids',
      mosys_grids_annotate: 'Grid Editor',
      mosys_grids_show: 'View',
      mosys_grids_edit: 'Edit',
      mosys_grids_create: 'Create Grid'
    },
    documents: {
      label: 'Documents',
      documents_list: 'All Documents',
      documents_copy_url: 'Copy URL',
      documents_delete: 'Delete',
      documents_download: 'Download',
      documents_edit: 'Edit'
    },
    users: {
      label: 'Account settings',
      users_manage: 'Account settings'
    }
  },
  routes: {
    documents: {
      edit: {
        title: 'Edit Document'
      },
      create: {
        title: 'Add Document'
      },
      list: {
        title: 'Documents'
      }
    },
    annotate: {
      media: {
        title: 'Annotate Media',
        caption: 'Select a map and enter a media URL to start annotating.'
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
    vocabularies: {
      trees: {
        title: 'Vocabulary list',
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
    groups: {
      list: {
        title: 'Groups',
        caption: 'Manage your groups.'
      },
      edit: {
        title: 'Edit group',
        caption: 'Edit this group.'
      },
      new: {
        title: 'New group',
        caption: 'Create a new group.'
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
        export: {
          title: 'Export Timeline',
          caption: 'Export associated annotations.'
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
        },
        media: {
          title: 'Media',
          caption: '.'
        }
      },
      media: {
        list: {
          title: 'Media',
          caption: 'All your most wonderful media are here.'
        },
        edit: {
          title: 'Edit media',
          caption: 'Edit media details.'
        },
        create: {
          title: 'Add Media',
          caption: 'Add a new media to your timeline.'
        },
        sync: {
          title: 'Sync Media',
          caption: 'Synchronize media reference time.'
        }
      }
    },
    mosys: {
      cells: {
        edit_cell: 'Edit Cell'
      },
      add: {
        title: 'Add',
        caption: 'Add an URL'
      },
      grids: {
        buttons: {
          edit: 'Edit',
          show: 'View',
          annotate: 'Grid Editor'
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
          title: 'Edit',
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
    copyright: 'Copyright 2020',
    license: 'License',
    tagline: 'Digital Research and Annotation Platform for Contemporary Dance.',
    title: 'Web Systems',
    version: 'UI Version'
  },
  table: {
    no_data: 'No data to display.',
    no_data_in_filter: 'Filter yielded no results.'
  }
}
