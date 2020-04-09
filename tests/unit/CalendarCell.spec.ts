import { shallowMount } from '@vue/test-utils';
import CalendarCell from '@/components/CalendarCell.vue';

describe('CalendarCell.vue', () => {
  it('renders props.msg when passed', () => {

    const data: CustomTypes.MyDay = {
      date: new Date(2020, 0, 1),
      isTarget: false,
      isCurrent: false,
      isHoliday: false, // TODO
      holidayName: '', // TODO
      week: '土',
      planTime: { inputTime: '', hours: 0, minutes: 0 },
      totalTime: { inputTime: '', hours: 0, minutes: 0 },
      remainingTime: { inputTime: '', hours: 0, minutes: 0 },
      categoryTimes: [
        { inputTime: '', hours: 0, minutes: 0 },
        { inputTime: '', hours: 0, minutes: 0 },
        { inputTime: '', hours: 0, minutes: 0 }
      ],
      text: ''
    };
    const categoryNames = ['A', 'M', '他'];
    const wrapper = shallowMount(CalendarCell, {
      propsData: { data, categoryNames }
    });
    expect(wrapper.props().data).toBe(data);
    expect(wrapper.props().categoryNames).toBe(categoryNames);
    expect(wrapper.contains('table')).toBe(true);
  });
});
