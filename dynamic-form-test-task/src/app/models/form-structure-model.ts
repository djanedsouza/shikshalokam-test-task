export interface FormStructureModel {
  title: string;
  formFields: [
    {
      label: string;
      formattedLabel?: string;
      fields: [
        type: string,
        label: string,
        name: string,
        validations: {
          isRequired: string;
          pattern?: string;
        },
        placeholder?: string,
        options?: [
          {
            label: string;
            value: string;
          }
        ]
      ];
    }
  ];
}
