import { shallowMount } from '@vue/test-utils';
import CalendarCell from '@/components/CalendarCell.vue';

describe('CalendarCell.vue', () => {
  it('renders props.msg when passed', () => {

    const data: CustomTypes.MyDay = {
      date: new Date(2020, 0, 1),
      month: 1,
      day: 1,
      keyDayString: '2020-01-01',
      isTarget: false,
      isCurrent: false,
      isHoliday: false, // TODO
      isLock: false,
      holidayName: '', // TODO
      week: '土',
      planTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      totalTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      remainingTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      categoryTimes: [
        { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
        { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
        { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 }
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
