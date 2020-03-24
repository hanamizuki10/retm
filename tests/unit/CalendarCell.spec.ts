import { shallowMount } from '@vue/test-utils';
import CalendarCell from '@/components/CalendarCell.vue';

describe('CalendarCell.vue', () => {
  it('renders props.msg when passed', () => {
    const day = '1';
    const holidayName = '日本の祝日';
    const wrapper = shallowMount(CalendarCell, {
      propsData: { day, holidayName }
    });
    expect(wrapper.props().day).toBe(day);
    expect(wrapper.props().holidayName).toBe(holidayName);
    expect(wrapper.contains('table')).toBe(true);

  });
});
